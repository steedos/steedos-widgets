export class NavigationGuard {
  constructor() {
    this.handlers = new Map();
    this.nextId = 1;
    this.defaultOptions = {
      showConfirm: true,
      confirmMessage: '确定要离开吗？'
    };
    this.isProcessing = false;
  }

  // 注册 beforeChange 处理器
  registerBeforeChange(handler, options = {}) {
    const id = this.nextId++;
    const handlerConfig = {
      id,
      handler,
      name: options.name || `handler_${id}`,
      priority: options.priority || 0,
      showConfirm: options.showConfirm ?? true,
      confirmMessage: options.confirmMessage,
      skipDefaultConfirm: options.skipDefaultConfirm || false,
      enabled: options.enabled !== false
    };
    console.log(`registerBeforeChange`, id, handlerConfig)
    this.handlers.set(id, handlerConfig);
    
    // 返回取消注册的函数
    return () => {
      this.handlers.delete(id);
    };
  }

  // 批量注册
  registerMultiple(handlers) {
    const unregisterFns = [];
    
    handlers.forEach(({ handler, options = {} }) => {
      const unregister = this.registerBeforeChange(handler, options);
      unregisterFns.push(unregister);
    });
    
    // 返回批量取消注册的函数
    return () => {
      unregisterFns.forEach(fn => fn());
    };
  }

  // 执行所有处理器
  async executeHandlers(blocker) {
    console.log(`executeHandlers`, blocker);
    if (this.isProcessing) {
      console.warn('Navigation guard is already processing');
      return { allowed: true };
    }

    this.isProcessing = true;
    
    try {
      // 按优先级排序（优先级高的先执行）
      const sortedHandlers = Array.from(this.handlers.values())
        .filter(h => h.enabled)
        .sort((a, b) => b.priority - a.priority);
      
      console.log(`Executing ${sortedHandlers.length} navigation guards`);
      
      // 收集所有阻止信息
      const blockResults = [];
      
      for (const config of sortedHandlers) {
        try {
          const result = await config.handler(blocker);
          
          if (result === false) {
            // 直接返回 false，立即阻止
            blockResults.push({
              handler: config.name,
              reason: 'returned-false',
              message: config.confirmMessage,
              config
            });
            break;
          } else if (result && typeof result === 'object') {
            if (result.allowed === false) {
              blockResults.push({
                handler: config.name,
                reason: result.reason || 'blocked-by-object',
                message: result.message || config.confirmMessage,
                data: result.data,
                config
              });
              break;
            }
          }
          // 返回 true 或 undefined 表示允许
        } catch (error) {
          console.error(`Navigation guard [${config.name}] error:`, error);
          // 错误时默认阻止
          blockResults.push({
            handler: config.name,
            reason: 'handler-error',
            message: '处理器发生错误，导航已取消',
            error,
            config
          });
          break;
        }
      }
      
      if (blockResults.length > 0) {
        return {
          allowed: false,
          blockedBy: blockResults[0],
          allBlocks: blockResults
        };
      }
      
      return { allowed: true };
      
    } finally {
      this.isProcessing = false;
    }
  }

  // 清空所有处理器
  clearAll() {
    this.handlers.clear();
    console.log('All navigation guards cleared');
  }

  // 获取处理器数量
  getHandlerCount() {
    return this.handlers.size;
  }

  // 列出所有处理器
  listHandlers() {
    return Array.from(this.handlers.values()).map(h => ({
      id: h.id,
      name: h.name,
      priority: h.priority,
      enabled: h.enabled
    }));
  }

  // 启用/禁用特定处理器
  setHandlerEnabled(handlerId, enabled) {
    const handler = this.handlers.get(handlerId);
    if (handler) {
      handler.enabled = enabled;
      return true;
    }
    return false;
  }

  // 移除特定处理器
  removeHandler(handlerId) {
    return this.handlers.delete(handlerId);
  }
}