import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Button } from "../../components/Button/Button";
import { Form } from "../../components/Form/Form";
import { Input } from "../../components/Input/Input";
import { LOCAL_STORAGE_JWT_TOKEN_KEY } from "../../constants/constants";
import { UserContext } from "../../contexts/UserContextWrapper";

const LoginContainer = styled.div`
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

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();

    const handleLogin = () => {
        setIsLoading(true);

        fetch(`${process.env.REACT_APP_API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email, 
                password
            })
        })
        .then((res) => {
            if (res.status === 401) {
                throw new Error('Incorrect email or password');
            }

            if (!res.ok) {
                throw new Error('Something went wrong');
            }

            return res.json();
        })
        .then((data) => {
            const { id, email, token } = data;
            localStorage.setItem(LOCAL_STORAGE_JWT_TOKEN_KEY, token);
            setUser({ id, email });
            setIsLoading(false);
            setError('');
            navigate('/');
        })
        .catch((e) => {
            setError(e.message);
            setIsLoading(false);
        })
    }

    return (
        <LoginContainer>
            <FormStyled onSubmit={handleLogin} disabled={isLoading} column>
                <h1>Organizers login</h1>
                <Input 
                    placeholder="Email" 
                    required
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                />
                <Input 
                    placeholder="Password" 
                    required
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                />
                {error && <ErrorStyled>{error}</ErrorStyled>}
                <Button>Login</Button>
                <LinkStyled to="/register">Register</LinkStyled>
            </FormStyled>
        </LoginContainer>
    );
}