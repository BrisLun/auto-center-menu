import '../styles/App.scss';
import Menu from './Menu'

function App() {

  const menuList = ['fruits', 'clothes', 'books', 'beauty', 'office product', 'health', 'sports', 'kitchen']

  return (
    <div className="App">
      <Menu menuList={menuList} />
    </div>
  );
}

export default App;
