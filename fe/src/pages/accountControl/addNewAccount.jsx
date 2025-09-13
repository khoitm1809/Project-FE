import { Box, Typography } from "@mui/material";
import { BoxContainer } from "../../components/commonStyled";


const AddNewAccount = () => {

    return (
        <BoxContainer padding={'2rem'}>
            <Box sx={{ alignContent: 'center', marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
                <Typography variant="14500" >Add new Account</Typography>
            </Box>

        </BoxContainer>
    )
}

export default AddNewAccount;