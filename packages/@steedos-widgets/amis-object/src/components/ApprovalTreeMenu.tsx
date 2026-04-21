  // 使用 fetchNavRef 间接调用，依赖仅为 actualApiUrl（接口地址）。
  // 这样 syncSelectionByUrl/resolvedAppId 等纯客户端逻辑的引用变化
  // 不会触发重新 fetch，避免切换应用时因 amis context 变化导致多余请求。
  // 同一应用内 actualApiUrl 不变，reload/角标刷新通过 postMessage → fetchNavRef 触发。
  useEffect(() => {
    fetchNavRef.current?.();
    return () => {
      abortControllerRef.current?.abort();
    };
  }, [actualApiUrl]);