import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Route, useNavigate } from "react-router-dom";
import { Routes } from 'react-router-dom';
import Chat from "./components/Chat/Chat";


function App() {
	const navigate = useNavigate();
	// const [count, setCount] = useState(0);
	const [isStudent, setIsStudent] = useState(false);
	const [isEnterprise, setIsEnterprise] = useState(false);

	const [isGo, setIsGo] = useState(false);

	const [isStudentName, setIsStudentName] = useState("");

	const handleClickStudent = (e) => {
		setIsStudent(!isStudent);
		setIsEnterprise(false);
	};

	const handleClickEnterprise = (e) => {
		setIsEnterprise(!isEnterprise);
		setIsStudent(false);
	};

	const handleClickGo = (e) => {
		setIsGo(!isGo);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		setIsStudentName("");
	};

	return (
		<>
			{/*  
			<div>
				<a href="https://vitejs.dev" target="_blank">
					<img src={viteLogo} className="logo" alt="Vite logo" />
				</a>
			</div>
      */}
			<div className="logo-app">
				<h1>Trends</h1>
				<h4>Hello </h4>
			</div>

			{!isGo && (
				<div>
					<p>Are you a student or an enterprise ?</p>

					<div>
						{/* btn Student */}

						{!isEnterprise && (
							<button
								className="btn-app"
								style={{ margin: 10, padding: 10 }}
								onClick={handleClickStudent}
							>
								Student
							</button>
						)}

						{/* wo this div tag the btns stay horizontal */}
						<div></div>

						{/* btn Enterprise */}

						{!isStudent && (
							<button
								className="btn-app"
								style={{ margin: 10, padding: 10 }}
								onClick={handleClickEnterprise}
							>
								Enterprise
							</button>
						)}
					</div>

					{/* form Student  */}

					{isStudent && (
						<div className="form-student-app">
							<form onSubmit={handleSubmit}>
								<label>
									<input
										id="StudentName"
										name="StudentName"
										value={isStudentName}
										type="text"
										placeholder="your name"
										onChange={(e) =>
											setIsStudentName(e.target.value)
										}
									/>
								</label>
								<p></p>

								<label>
									<input
										type="number"
										placeholder="your age"
									/>
								</label>
								<p></p>

								<label>
									<input
										type="text"
										placeholder="What are you study ?"
									/>
								</label>
								<p></p>
							</form>
						</div>
					)}

					{/* btn Enterprise */}

					{isEnterprise && (
						<div>
							<div className="form-student-app">
								<form>
									<label>
										<input
											type="text"
											placeholder="Enterprise name"
										/>
									</label>
									<p></p>

									<label>
										<input
											type="text"
											placeholder="Industry / sector"
										/>
									</label>
									<p></p>

									<label>
										<input
											type="text"
											placeholder="what are you searching ?"
										/>
									</label>
									<p></p>
								</form>
							</div>
						</div>
					)}
				</div>
			)}

			{(isStudent || isEnterprise) && !isGo && (
				<div>
					<button onClick={handleClickGo}> Go </button>
				</div>
			)}

			{/* Discovery for Student  */}

			{isGo && isStudent && (
				<div>
					<div>
						Enterprise A<button>Talk </button>
					</div>
					<p></p>

					<div>
						Enterprise B <button>Talk</button>
					</div>
					<p></p>

					<div>
						Enterprise C <button>Talk</button>
					</div>
					<p></p>

					<div>
						Enterprise D <button>Talk</button>
					</div>
					<p></p>

					<button onClick={handleClickGo}>Back</button>
				</div>
			)}

			{/* Discovery for Enterprise */}

			{isGo && isEnterprise && (
				<div>
					<div>
						Student A <button>Talk</button>
					</div>
					<p></p>

					<div>
						Student B <button>Talk</button>{" "}
					</div>
					<p></p>

					<div>
						Student C <button>Talk</button>{" "}
					</div>
					<p></p>

					<div>
						Student D <button>Talk</button>
					</div>
					<p></p>

					<button onClick={handleClickGo}>Back</button>
				</div>
			)}

			{/*  			<div className="card">
				<button onClick={() => setCount((count) => count + 1)}>
					count is {count}
				</button>

				{/* <p>
					Edit <code>src/App.jsx</code> and save to test HMR
				</p> 
			 	</div>*/}

			{/* 
			<p className="read-the-docs">
				Click on the Vite and React logos to learn more
			</p>
      */}
	  <Routes>
		<Route path={'/Trends_app_MVP/chat'} element={<Chat />} />
	  </Routes>
	  <button onClick={() =>{navigate('/Trends_app_MVP/chat')}}>Ir al chat</button>
		</>
	);
}

export default App;
