import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik';
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
import * as yup from 'yup';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { Container } from '@mui/material';
import userApi from '../api/userApi';
import { db, auth, storage } from "../firebase/firebase"
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

const EditUser = ({ showEditUser, data }) => {
    console.log('data edit ', data)
    const [formEditData, setFormEditData] = useState({
        userName: data.userName,
        email: data.email,
        password: data.password,
        passwordConfirmation: data.password,
        phone: data.phone
    })
    useEffect(() =>{
        setFormEditData({
            userName: data.userName,
            email: data.email,
            password: data.password,
            passwordConfirmation: data.password,
            phone: data.phone
        })
    },[data])
    const formikEdit = useFormik({
        initialValues: {
            userName: formEditData.userName,
            email: formEditData.email,
            password: formEditData.password,
            passwordConfirmation: formEditData.passwordConfirmation,
            phone: formEditData.phone
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            // const response = await userApi.signup(values);
            // if (response.success) {
            //     const result = await auth.createUserWithEmailAndPassword(values.email, values.password);
            //     storage.collection("users").add({
            //         uid: result.user.uid,
            //         name: values.userName,
            //         email: values.email,
            //         createdAt: db.firestore.Timestamp.fromDate(new Date()),
            //         isOnline: false,
            //         avatar: "https://vnn-imgs-f.vgcloud.vn/2020/03/23/11/trend-avatar-11.jpg"
            //     })
            //     getAllUsers()
            // } else {
            //     console.log(response)
            // }
            // toast(response.message, {
            //     position: "bottom-right",
            //     autoClose: 3000,
            //     hideProgressBar: false,
            //     closeOnClick: true,
            //     pauseOnHover: true,
            //     draggable: true,
            //     progress: undefined,
            // });
        },
    });
    return (
        showEditUser ? (
            <div style={{ width: '400px' }} className="ml-2 p-5 border-2">
                <div className="w-full flex justify-center items-center text-xl font-bold">
                    Edit User
                </div>
                <form onSubmit={formikEdit.handleSubmit}>
                    <TextField
                        fullWidth
                        id="userName"
                        name="userName"
                        label="Name"
                        value={formikEdit.values.userName}
                        onChange={formikEdit.handleChange}
                        error={formikEdit.touched.userName && Boolean(formikEdit.errors.userName)}
                        helperText={formikEdit.touched.userName && formikEdit.errors.userName}
                    />
                    <TextField
                        fullWidth
                        id="email"
                        name="email"
                        label="Email"
                        value={formikEdit.values.email}
                        onChange={formikEdit.handleChange}
                        error={formikEdit.touched.email && Boolean(formikEdit.errors.email)}
                        helperText={formikEdit.touched.email && formikEdit.errors.email}
                    />
                    <TextField
                        fullWidth
                        id="phone"
                        name="phone"
                        label="phone"
                        value={formikEdit.values.phone}
                        onChange={formikEdit.handleChange}
                        error={formikEdit.touched.phone && Boolean(formikEdit.errors.phone)}
                        helperText={formikEdit.touched.phone && formikEdit.errors.phone}
                    />
                    <TextField
                        fullWidth
                        id="password"
                        name="password"
                        label="Password"
                        type="password"
                        value={formikEdit.values.password}
                        onChange={formikEdit.handleChange}
                        error={formikEdit.touched.password && Boolean(formikEdit.errors.password)}
                        helperText={formikEdit.touched.password && formikEdit.errors.password}
                    />
                    <TextField
                        fullWidth
                        id="passwordConfirmation"
                        name="passwordConfirmation"
                        label="Password Confirmation"
                        type="password"
                        value={formikEdit.values.passwordConfirmation}
                        onChange={formikEdit.handleChange}
                        error={formikEdit.touched.passwordConfirmation && Boolean(formikEdit.errors.passwordConfirmation)}
                        helperText={formikEdit.touched.passwordConfirmation && formikEdit.errors.passwordConfirmation}
                    />

                    <div style={{ marginTop: "10px" }}>
                        <Button color="primary" variant="contained" fullWidth type="submit">
                            Submit
                        </Button>
                    </div>
                </form>
            </div>
        ) : null)

}

export default EditUser