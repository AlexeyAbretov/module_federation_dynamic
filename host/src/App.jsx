import React, { useState } from 'react';
import { DynamicRemote } from './DynamicRemote'

const App = () => {
    const [app, setApp] = useState('app1');

    return (
        <>
            <div>I am App!!!</div>

            <button onClick={() => setApp(app === 'app1' ? 'app2' : 'app1')}>Switch App</button>

            <React.Suspense
                fallback={<div>Loading...</div>}>
                {app === 'app1' && <DynamicRemote
                    remote={'app1'}
                    module={'./app1Component'}
                    url={'http://localhost:4001/remoteEntry.js'}
                />}
                 {app === 'app2' && <DynamicRemote
                    remote={'app2'}
                    module={'./app2Component'}
                    url={'http://localhost:4002/remoteEntry.js'}
                />}
            </React.Suspense>
        </>
    )
};

export default App;