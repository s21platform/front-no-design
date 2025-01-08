import Header from "../components/Header/Header";
import Home from "../components/Home/Home";

const MainPage = () => {
    // const [isRegistered, setIsRegistered] = useState<boolean>(false)
    // const [login, setLogin] = useState<string>("")
    // const [password, setPassword] = useState<string>("")
    //
    // useEffect(() => {
    //     const flag = localStorage.getItem("isRegistered")
    //     if (flag) {
    //         setIsRegistered(true)
    //     }
    // }, []);
    //
    // const registration = () => {
    //     axios.post("/auth/login", {
    //         username: login,
    //         password
    //     }).then(res => {
    //         if (res.status === 200) {
    //             setIsRegistered(true)
    //             // localStorage.setItem("")
    //         }
    //     })
    // }

    return (
        <div>
            <Header />
            <Home />
            {/*{!isRegistered && <button onClick={registration}>Do Auth</button>}*/}
            {/*{!isRegistered && (*/}
            {/*    <>*/}
            {/*        <div>*/}
            {/*            <label htmlFor="login">Login</label>*/}
            {/*            <input type="text" id={"login"} value={login} onChange={(e) => setLogin(e.target.value)} />*/}
            {/*        </div>*/}
            {/*        <div>*/}
            {/*            <label htmlFor="password">Pass</label>*/}
            {/*            <input type="text" id={"password"} value={password} onChange={(e) => setPassword(e.target.value)} />*/}
            {/*        </div>*/}
            {/*    </>*/}

            {/*)}*/}
            {/*{isRegistered ? <div>Auth</div> : <div>Not Auth</div>}*/}
        </div>
    )
}

export default MainPage;
