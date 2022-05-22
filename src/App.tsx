import PostListContainer from "./containers/PostListContainer/PostListContainer";

import './App.css';

function App() {
    return (
        <>
            <header>
                <h1>HACKER NEWS</h1>
            </header>
            <div className="App">
                <PostListContainer />
            </div>
        </>
    );
}


export default App;
