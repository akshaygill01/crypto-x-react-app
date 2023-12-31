
import { BrowserRouter as Router,Routes,Route } from "react-router-dom";
import Home from "./component/Home";
import Header from "./component/Header";
import Coins from "./component/Coins";
import Exchanges from "./component/Exchanges";
import CoinDetails from "./component/CoinDetails";
import Footer from "./component/Footer";
function App() {
  return (
    <Router>
     <Header/>
      <Routes>
         <Route path="/" element={<Home/>}></Route>
         <Route path="/coins" element={<Coins/>}></Route>
         <Route path="/exchanges" element={<Exchanges/>}></Route>
         <Route path="/coins/:id" element={<CoinDetails/>}></Route>
         
       </Routes>
       <Footer/>
    </Router>
  );
}

export default App;
