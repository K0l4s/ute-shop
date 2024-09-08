import Footer from "./components/footer/Footer";
import Navbar from "./components/navbar/Navbar";
import Router from "./router/Router";


function App() {
  return (
    <>
    <Navbar />
    <div className="overflow-auto">
    <Router />
    </div>
    <Footer/>
    </>
  );
}

export default App;