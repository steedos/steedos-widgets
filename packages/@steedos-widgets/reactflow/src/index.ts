export * from './components';

import ReactFlow from 'reactflow';

if(typeof window === "undefined"){
    (window as any)['ReactFlow'] = ReactFlow
}

export {
    ReactFlow
}