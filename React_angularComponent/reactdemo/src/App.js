import './App.css';
import React from 'react';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <FunApp name='Function' />
        <ClassApp name='Class' />
        <AppHook name='Hook' />
        <NumberList numbers={[1,2,3,4,5,6]}/>
      </header>
    </div>
  );
}
// Function 组件
function FunApp(props) {
  return <h1 onClick={Funclick}>函数式{props.name}</h1>
}
function Funclick() {
  console.log('Functio Component')
}



// Class 组件
class ClassApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = { date: new Date() };
  }
  ClassClick() {
    console.log('Class Component')
  }
  // 初始化
  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }
  // Dom移除
  componentWillUnmount() {
    clearInterval(this.timerID);
  }
  //State 的更新可能是异步的
  // 出于性能考虑，React 可能会把多个 setState() 调用合并成一个调用。
  // 因为 this.props 和 this.state 可能会异步更新，所以你不要依赖他们的值来更新下一个状态。
  // 调用setState会自动把更新的数据合并到state
  tick() {
    this.setState({
      date: new Date()
    });
  }
  render() {
    return <h1 onClick={this.ClassClick}>类式{this.props.name}，时间{this.state.date.toLocaleTimeString()}</h1>
  }
}



// Function 组件进化版   Hook
// useState  会保存上一次的值
function AppHook(props) {
  const [count, SetCount] = React.useState(0)

  React.useEffect(() => {
    setTimeout(() => {
      SetCount(count + 1)
    }, 1000)
  }, [count])

  return (
    <div>
      <h1 onClick={HookClick}>AppHook {count}，PropsName{props.name}</h1>
    </div>
  )
}
function HookClick() {
  console.log('HookClick')
}


//可以直接在模板中插入js
function NumberList(props) {
  const numbers = props.numbers;
  return (
    <ul>
      {/* 兄弟组件之间必须要有Key */}
      {numbers.map((number) =>
        <div key={number}>{number}</div>
      )}
    </ul>
  );
}
export default App;
