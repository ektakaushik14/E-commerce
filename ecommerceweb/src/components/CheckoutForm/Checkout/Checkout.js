import React, {useState, useEffect} from 'react'
import {Paper, Stepper, Step, StepLabel, Typography, CircularProgress, Divider, Button, CssBaseline} from '@material-ui/core';
import useStyles from '../Checkout/styles';
import AddressForm from '../AddressForm';
import {commerce} from '../../../lib/commerce';
import PaymentForm from '../PaymentForm';
import {Link , useHistory } from 'react-router-dom';
const steps= ['shipping address', 'Payment details'];
export default function Checkout({cart, order, onCaptureCheckout, error}) {
    const classes= useStyles();
    const [checkoutToken, setCheckoutToken] =useState(null);
    const [activeStep, setActiveStep]= useState(0);
const [shippingData, setShippingData] =useState({});
const [isFinished, setIsFinished] = useState(false);
const history= useHistory();
    useEffect(()=>{
        const generateToken =async()=>{
            try{
                const token =await commerce.checkout.generateToken(cart.id, {type: 'cart'});
                setCheckoutToken(token);
            }catch (error){
                history.push('/')
            }
        }
        generateToken();
    }, [cart]);

    const nextStep =()=> setActiveStep((prevActiveStep)=> prevActiveStep +1);
    const backStep =()=> setActiveStep((prevActiveStep)=> prevActiveStep -1);

    const next=(data)=>{
        setShippingData(data);
        nextStep();
    }

    const timeout =()=>{
        setTimeout(() => {
            setIsFinished(true)
        }, 3000);
    }

    const Confirmation=()=> order.customer ?(
        <div>
        <div>
            <Typography variant="h5">Thank you for your purchase, {order.customer.firstName} {order.customer.lastName}</Typography>
            <Divider className={classes.divider} />
            <Typography variant="subtitle2">Order ref: {order.customer_reference}</Typography>
        </div>
        <br />
        <Button component={Link} to="/" variant="outlined" type="button">Back to Home</Button>
        </div>
    ): isFinished ? (
        <div>
        <div>
            <Typography variant="h5">Thank you for your purchase</Typography>
            <Divider className={classes.divider} />
        </div>
        <br />
        <Button component={Link} to="/" variant="outlined" type="button">Back to Home</Button>
        </div>
    ) :(
        <div className={classes.spinner}>
            <CircularProgress />
        </div>
    );

        if(error){
            <div>
                <Typography variant="h5">Error: {error}</Typography>
                <br />
                <Button component={Link} to="/" variant="outlined" type="button">Back to Home</Button>
            </div>
        }

    const Form=()=>activeStep ==0
    ?<AddressForm checkoutToken={checkoutToken} next/>
    :<PaymentForm shippingData={shippingData} checkoutToken={checkoutToken} nextStep={nextStep} backStep={backStep} onCaptureCheckout={onCaptureCheckout} timeout={timeout} />

    return (
        <div>
            <CssBaseline />
            <div className={classes.toolbar} />
            <main className={classes.layout}>
                <Paper className={classes.paper}>
                    <Typography variant ="h4" align="center">Checkout</Typography>
                    <Stepper activeStep={0} className={classes.stepper}>
                        {steps.map((step)=>(
                            <Step key={step}>
                                <StepLabel>{step}
                                </StepLabel>
                                </Step>
                        ))}
                    </Stepper>
                    { activeStep == steps.length ? <Confirmation /> : checkoutToken && <Form />}
                </Paper>
            </main>
        </div>
    )
}
