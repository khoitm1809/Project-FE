import { Box, Button, Typography } from '@mui/material';
import { useLocation } from 'react-router';

export default function DetailPage() {
    const location = useLocation();
    const item = location.state.item;
    console.log(item, '???')

    return (
        <Box>
            <Typography>
                {item?.name}
            </Typography>
        </Box>
    );
}
