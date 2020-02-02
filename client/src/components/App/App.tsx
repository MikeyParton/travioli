import React from 'react';

interface IProps {
  text?: string;
}

function App({ text = 'test' }: IProps) {
  return (
    <div>
      <h1>
        Hello World!
        {text}
      </h1>
    </div>
  );
}

export default App;
