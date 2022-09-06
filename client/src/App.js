import Home from "./components/Home";
import CreatePost from "./components/CreatePost";
import EditPost from "./components/EditPost";
import Post from "./components/Post";
import Registration from "./components/Registration";
import Login from "./components/Login";
import Layout from "./components/Layout";
import Admin from "./components/Admin";
import Posts from "./components/Posts";
import RequireAuth from "./components/RequireAuth";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route Path="/" element={<Layout />}>
        <Route path="/registration" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        {/* Protected routes */}
        <Route element={<RequireAuth allowedRoles={["1021"]} />}>
          <Route path="/post/:id" element={<Post />} />
          <Route path="/createpost" element={<CreatePost />} />
          <Route path="/post/edit/:id" element={<EditPost />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/posts" element={<Posts />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
