import React, { useLayoutEffect, useState } from 'react'
import { AiOutlineLeft, AiOutlineUserAdd } from "react-icons/ai";
import { ToastContainer, toast } from 'react-toastify';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import adminApi from '../api/adminApi';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { Container } from '@mui/material';
import userApi from '../api/userApi';
import { db, auth, storage } from "../firebase/firebase"
import EditUser from '../Components/EditUser';
// import { setDoc, doc, Timestamp } from "firebase/firestore";
// import { createUserWithEmailAndPassword } from 'firebase/auth'

const validationSchema = yup.object({
    userName: yup
        .string('Enter your user name').required('user name is required'),
    email: yup
        .string('Enter your email')
        .email('Enter a valid email')
        .required('Email is required'),
    password: yup
        .string('Enter your password')
        .min(8, 'Password should be of minimum 8 characters length')
        .required('Password is required'),
    passwordConfirmation: yup.string()
        .oneOf([yup.ref('password'), null], 'Passwords must match'),
    phone: yup
        .number().required('phone is required'),
});

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

const ManagementUser = () => {
    const [data, setData] = useState(null)
    const [showNewUser, setShowNewUser] = useState(false);
    const [showEditUser, setShowEditUser] = useState(false);
    const [formData, setFormData] = useState({
        userName: '',
        email: '',
        password: '',
        passwordConfirmation: '',
        phone: ''
    })
    const [formEditData, setFormEditData] = useState({
        userName: '',
        email: '',
        password: '',
        passwordConfirmation: '',
        phone: ''
    })
    const getAllUsers = async () => {
        const response = await adminApi.getAllUsers();
        setData(response.data)
    }
    useLayoutEffect(() => {
        getAllUsers()
    }, [])

    const handlerAdminDeleteUser = async (id) => {
        const response = await adminApi.adminDeleteUser(id)
        if (response.success) {
            setData(response.data)
            toast(response.message, {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                draggable: true,
                progress: undefined,
            });
        }
    }

    const handlerAdminEditUser = (data) => {
        setShowNewUser(false)
        setShowEditUser(true)
        setFormEditData(data)
        console.log('data', data)
    }

    const handlerNewUser = () => {
        setShowNewUser(true)
        setShowEditUser(false)
    }


    const formik = useFormik({
        initialValues: {
            userName: formData.userName,
            email: formData.email,
            password: formData.password,
            passwordConfirmation: formData.passwordConfirmation,
            phone: formData.phone
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            const response = await userApi.signup(values);
            console.log('response', response);
            if (response.success) {
                const result = await auth.createUserWithEmailAndPassword(values.email, values.password);
                storage.collection("users").doc(result.user.uid).set({
                    uid: result.user.uid,
                    name: values.userName,
                    email: values.email,
                    createdAt: db.firestore.Timestamp.fromDate(new Date()),
                    isOnline: false,
                    avatar: "https://vnn-imgs-f.vgcloud.vn/2020/03/23/11/trend-avatar-11.jpg"
                })
                setFormEditData({
                    userName: '',
                    email: '',
                    password: '',
                    passwordConfirmation: '',
                    phone: ''
                })
                const update = await userApi.updateUid({_id: response.data._id, uid:result.user.uid });
                if(update.success){
                    console.log('update success', update)
                }
                getAllUsers()
            } else {
                console.log(response)
            }
            toast(response.message, {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        },
    });


    return (
        <div className="p-5">
            <div className="joinTeam__header">
                <div>
                    <AiOutlineLeft fontSize="16px" />
                </div>
                <div>
                    Back
                </div>
            </div>
            <div className="flex justify-between w-full">
                <div className="text-bold text-2xl mb-3">
                    Manage User
                </div>
                <div className="flex">
                    <div className="flex item-center justify-center bg-default cursor-pointer p-2 rounded-sm text-white" style={{ height: '40px' }} onClick={() => handlerNewUser()}>
                        <div className="mr-2">
                            <AiOutlineUserAdd />
                        </div>
                        <div>
                            New User
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex">
                <div style={{ width: '950px' }}>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 700 }} aria-label="table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>Email</StyledTableCell>
                                    <StyledTableCell align="right">Name</StyledTableCell>
                                    <StyledTableCell align="right">Phone</StyledTableCell>
                                    <StyledTableCell align="right">Role</StyledTableCell>
                                    <StyledTableCell align="center">Actions</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data?.map((row) => (
                                    <StyledTableRow key={row.email}>
                                        <StyledTableCell>
                                            {row.email}
                                        </StyledTableCell>
                                        <StyledTableCell align="right">
                                            {row.userName}
                                        </StyledTableCell>
                                        <StyledTableCell align="right">{row.phone}</StyledTableCell>
                                        <StyledTableCell align="right">{row.typeUser}</StyledTableCell>
                                        <StyledTableCell align="right">
                                            <div className="flex">
                                                <div className="p-2 bg-red-600 text-white cursor-pointer mr-2 " onClick={() => handlerAdminDeleteUser(row._id)}>
                                                    Delete
                                                </div>
                                                <div className="p-2 bg-blue-600 text-white cursor-pointer" onClick={() => handlerAdminEditUser(row)}>
                                                    Edit
                                                </div>
                                            </div>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
                <div className="flex justify-center items-center" style={{ width: '650px' }}>
                    {
                        showNewUser ? (
                            <div style={{ width: '400px' }} className="ml-2 p-5 border-2">
                                <div className="w-full flex justify-center items-center text-xl font-bold">
                                    New User
                                </div>
                                <form onSubmit={formik.handleSubmit}>
                                    <TextField
                                        fullWidth
                                        id="userName"
                                        name="userName"
                                        label="Name"
                                        value={formik.values.userName}
                                        onChange={formik.handleChange}
                                        error={formik.touched.userName && Boolean(formik.errors.userName)}
                                        helperText={formik.touched.userName && formik.errors.userName}
                                    />
                                    <TextField
                                        fullWidth
                                        id="email"
                                        name="email"
                                        label="Email"
                                        value={formik.values.email}
                                        onChange={formik.handleChange}
                                        error={formik.touched.email && Boolean(formik.errors.email)}
                                        helperText={formik.touched.email && formik.errors.email}
                                    />
                                    <TextField
                                        fullWidth
                                        id="phone"
                                        name="phone"
                                        label="phone"
                                        value={formik.values.phone}
                                        onChange={formik.handleChange}
                                        error={formik.touched.phone && Boolean(formik.errors.phone)}
                                        helperText={formik.touched.phone && formik.errors.phone}
                                    />
                                    <TextField
                                        fullWidth
                                        id="password"
                                        name="password"
                                        label="Password"
                                        type="password"
                                        value={formik.values.password}
                                        onChange={formik.handleChange}
                                        error={formik.touched.password && Boolean(formik.errors.password)}
                                        helperText={formik.touched.password && formik.errors.password}
                                    />
                                    <TextField
                                        fullWidth
                                        id="passwordConfirmation"
                                        name="passwordConfirmation"
                                        label="Password Confirmation"
                                        type="password"
                                        value={formik.values.passwordConfirmation}
                                        onChange={formik.handleChange}
                                        error={formik.touched.passwordConfirmation && Boolean(formik.errors.passwordConfirmation)}
                                        helperText={formik.touched.passwordConfirmation && formik.errors.passwordConfirmation}
                                    />

                                    <div style={{ marginTop: "10px" }}>
                                        <Button color="primary" variant="contained" fullWidth type="submit">
                                            Submit
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        ) : null
                    }
                    {
                        showEditUser ? (
                            <EditUser showEditUser={showEditUser} data={formEditData} />
                        ) : null
                    }
                </div>
            </div>
            <ToastContainer />
        </div>
    )
}

export default ManagementUser