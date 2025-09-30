import { useState } from 'react'

function Counter() {
    const [count, setCount] = useState(0);

    return (
        <>
            <button onClick={() => setCount(count + 1)}>
                Count is {count}
            </button>
        </>
    );
}

export default Counter;
