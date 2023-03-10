import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from "../../components/Button/Button";
import { Form } from "../../components/Form/Form";
import { Input } from "../../components/Input/Input";

const RegisterContainer = styled.div`
    align-items: center;
    background-color: lightgrey;
    display: flex;
    justify-content: center;
    height: 100vh;
`;

const LinkStyled = styled(Link)`
    align-self: center;
`;

const FormStyled = styled(Form)`
    max-width: 100%;
    padding: 20px;
    width: 400px;
`;

const ErrorStyled = styled.div`
    color: red;
    text-align: center;
`;

export const Register = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = () => {
        setIsLoading(true);

        fetch(`${process.env.REACT_APP_API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, name, surname, password })
        })
        .then((res) => {
            if (res.status === 400) {
                throw new Error('User already exists');
            }

            if (!res.ok) {
                throw new Error('Something went wrong');
            }

            return res.json();
        })
        .then(() => {
            navigate('/login');
            setIsLoading(false);
            setError('');
        })
        .catch((e) => {
            setError(e.message);
            setIsLoading(false);
        })
    };

    return (
        <RegisterContainer>
            <FormStyled onSubmit={handleRegister} disabled={isLoading} column>
                <h1>Organizers registration</h1>
                <Input 
                    placeholder="Email"
                    required
                    type="email" 
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                />
                <Input 
                    placeholder="Name" 
                    required
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                />
                <Input 
                    placeholder="Surname" 
                    required
                    onChange={(e) => setSurname(e.target.value)}
                    value={surname}
                />
                <Input 
                    placeholder="Password" 
                    required
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                />
                {error && <ErrorStyled>{error}</ErrorStyled>}
                <Button>Register</Button>
                <LinkStyled to="/login">Login</LinkStyled>
            </FormStyled>
        </RegisterContainer>
    );
}