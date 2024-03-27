import {PuffLoader} from "react-spinners";

export default function Spinner({fullWidth}) {
    const spinnerStyle = {
        display: 'flex',
        justifyContent: 'center',
        width: fullWidth ? '100%' : 'auto'
    }
    return (
        <div style={spinnerStyle}>
            <PuffLoader color={'#c23485'} speedMultiplier={3}/>
        </div>

    )
}