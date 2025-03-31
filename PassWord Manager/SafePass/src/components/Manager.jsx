import React, { useState, useEffect, useRef } from 'react';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import 'react-toastify/dist/ReactToastify.css';

const Manager = () => {
    const ref = useRef();
    const passwordRef = useRef();

    const [form, setform] = useState({ site: "", username: "", password: "" });
    const [passwordArray, setpasswordArray] = useState([]);

    useEffect(() => {
        let passwords = localStorage.getItem("passwords");
        if (passwords) {
            setpasswordArray(JSON.parse(passwords));
        }
    }, []);

    const copyText = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            toast.success('Copied to clipboard!');
        } catch (error) {
            toast.error('Failed to copy!');
        }
    };

    const showPassword = () => {
        if (passwordRef.current.type === "password") {
            passwordRef.current.type = "text";
            ref.current.src = "icons/eyecross.png";
        } else {
            passwordRef.current.type = "password";
            ref.current.src = "icons/eye.png";
        }
    };

    const savePassword = () => {
        if (form.site.length > 3 && form.username.length > 2 && form.password.length > 2) {
            setpasswordArray([...passwordArray, { ...form, id: uuidv4() }]);
            localStorage.setItem("passwords", JSON.stringify([...passwordArray, { ...form, id: uuidv4() }]));
            setform({ site: "", username: "", password: "" });
            toast.success('Password saved!');
        } else {
            toast.error('Please fill all fields correctly!');
        }
    };

    const deletePassword = (id) => {
        let c = confirm("Do you really want to delete this password?");
        if (c) {
            const updatedPasswords = passwordArray.filter(item => item.id !== id);
            setpasswordArray(updatedPasswords);
            localStorage.setItem("passwords", JSON.stringify(updatedPasswords));
            toast.success('Password Deleted!');
        }
    };

    const editPassword = (id) => {
        setform(passwordArray.filter(i => i.id === id)[0]);
        setpasswordArray(passwordArray.filter(item => item.id !== id));
    };

    const handleChange = (e) => {
        setform({ ...form, [e.target.name]: e.target.value });
    };

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Bounce}
            />

            <div className="absolute top-0 z-[-2] h-screen w-screen bg-green-50 bg-[radial-gradient(100%_50%_at_50%_0%,rgba(34,197,94,0.13)_0%,rgba(34,197,94,0)_50%,rgba(34,197,94,0)_100%)]"></div>

            <div className="md:mycontainer">
                <h1 className='text-4xl text font-bold text-center'>SafePass</h1>
                <p className='text-green-900 text-center text-lg'>Your own password manager</p>

                <div className="flex text-black flex-col p-4 mt-5 items-center gap-8">
                    <input value={form.site} onChange={handleChange} placeholder='Enter website URL' className='rounded-full border border-green-500 w-full p-4 py-1' type="text" name="site" id='site' />
                    <div className="flex flex-col md:flex-row w-full justify-between gap-8">
                        <input value={form.username} onChange={handleChange} placeholder='Enter Username' className='rounded-full border border-green-500 w-full p-4 py-1' type="text" name="username" id='username' />

                        <div className="relative">
                            <input ref={passwordRef} value={form.password} onChange={handleChange} placeholder='Enter Password' className='rounded-full border border-green-500 w-full p-4 py-1' type="password" name="password" id='password' />
                            <span className="absolute right-[3px] top-[4px] cursor-pointer" onClick={showPassword}>
                                <img ref={ref} className='p-1' width={26} src="icons/eye.png" alt="eye" />
                            </span>
                        </div>
                    </div>

                    <button onClick={savePassword} className='flex justify-center items-center gap-2 bg-green-400 hover:bg-green-300 rounded-full px-8 py-2 w-fit'>
                        <lord-icon
                            src="https://cdn.lordicon.com/jgnvfzqg.json"
                            trigger="hover">
                        </lord-icon>
                        Save
                    </button>
                </div>

                <div className="passwords">
                    <h2 className='font-bold text-2xl py-4 '>Your Passwords</h2>
                    {passwordArray.length === 0 && <div>No passwords to show</div>}
                    {passwordArray.length !== 0 &&
                        <table className="table-auto w-full rounded-md overflow-hidden">
                            <thead className='bg-green-800 text-white'>
                                <tr>
                                    <th className='py-2'>Site</th>
                                    <th className='py-2'>Username</th>
                                    <th className='py-2'>Password</th>
                                    <th className='py-2'>Actions</th>
                                </tr>
                            </thead>
                            <tbody className='bg-green-100'>
                                {passwordArray.map((item, index) => {
                                    return <tr key={index}>
                                        <td className='text-center py-2 border border-white'>
                                            <div className="flex items-center justify-center">
                                                <a href={item.site.startsWith('http') ? item.site : `https://${item.site}`} target='_blank' rel="noopener noreferrer">{item.site}</a>
                                                <div className="lordiconcopy size-7 cursor-pointer" onClick={() => copyText(item.site)}>
                                                    <lord-icon
                                                        style={{ "width": "25px", "height": "25px", "paddingTop": "3px", "paddingLeft": "3px" }}
                                                        src="https://cdn.lordicon.com/iykgtsbt.json"
                                                        trigger="hover">
                                                    </lord-icon>
                                                </div>
                                            </div>
                                        </td>
                                        <td className='text-center py-2 border border-white'>
                                            <div className="flex items-center justify-center">
                                                {item.username}
                                                <div className="lordiconcopy size-7 cursor-pointer" onClick={() => copyText(item.username)}>
                                                    <lord-icon
                                                        style={{ "width": "25px", "height": "25px", "paddingTop": "3px", "paddingLeft": "3px" }}
                                                        src="https://cdn.lordicon.com/iykgtsbt.json"
                                                        trigger="hover">
                                                    </lord-icon>
                                                </div>
                                            </div>
                                        </td>
                                        <td className='text-center py-2 border border-white'>
                                            <div className="flex items-center justify-center">
                                                <span>{"*".repeat(item.password.length)}</span>
                                                <div className="lordiconcopy size-7 cursor-pointer" onClick={() => copyText(item.password)}>
                                                    <lord-icon
                                                        style={{ "width": "25px", "height": "25px", "paddingTop": "3px", "paddingLeft": "3px" }}
                                                        src="https://cdn.lordicon.com/iykgtsbt.json"
                                                        trigger="hover">
                                                    </lord-icon>
                                                </div>
                                            </div>
                                        </td>
                                        <td className='text-center py-2 border border-white'>
                                            <span className='cursor-pointer mx-1' onClick={() => { editPassword(item.id) }}>
                                                <lord-icon
                                                    style={{ "width": "25px", "height": "25px", "paddingTop": "3px", "paddingLeft": "3px" }}
                                                    src="https://cdn.lordicon.com/gwlusjdu.json"
                                                    trigger="hover">
                                                </lord-icon>
                                            </span>
                                            <span className='cursor-pointer mx-1' onClick={() => { deletePassword(item.id) }}>
                                                <lord-icon
                                                    style={{ "width": "25px", "height": "25px", "paddingTop": "3px", "paddingLeft": "3px" }}
                                                    src="https://cdn.lordicon.com/skkahier.json"
                                                    trigger="hover">
                                                </lord-icon>
                                            </span>
                                        </td>
                                    </tr>
                                })}
                            </tbody>
                        </table>}
                </div>
            </div>
        </>
    );
};

export default Manager;