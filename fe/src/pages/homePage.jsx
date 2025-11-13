import { BoxBeetwen, BoxContainer, CenterBox, Column, Row } from "../components/commonStyled";
import { PieChart } from '@mui/x-charts/PieChart';
import { ROLES } from "../utils/rolesConstant";
import { BarChart, Gauge, LineChart } from "@mui/x-charts";
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Typography } from "@mui/material";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import { useState } from "react";

const data = [
    { label: 'Khỏe', value: 400, color: '#0088FE' },
    { label: 'Cần theo dõi', value: 300, color: '#00C49F' },
    { label: 'Ốm', value: 300, color: '#FFBB28' },
];
const settings = {
    margin: { right: 5 },
    width: 200,
    height: 200,
    hideLegend: true,
};

const chartSetting = {
    yAxis: [
        {
            label: 'Thức ăn và Vaccine tồn kho',
            width: 60,
        },
    ],
    height: 300,
};

const Home = () => {
    const [expanded, setExpanded] = useState('panel1');
    const role = localStorage.getItem("role");

    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };
    return (
        <BoxContainer>
            {role == ROLES.OWNER && <Box>
                <Box
                    sx={{
                        background: '#e2e2e2ff',
                        padding: '1rem',
                        borderRadius: '8px',
                        marginTop: '2rem',
                        marginX: '2rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-around'
                    }}>
                    <Column>
                        <Typography>Thức Ăn</Typography>
                        <Gauge
                            value={15}
                            startAngle={-110}
                            endAngle={110}
                            sx={{
                                width: 300,
                                height: 200,
                                marginTop: '2rem',
                                marginX: '2rem'
                            }}
                            text={({ value, valueMax }) => `${value} / ${valueMax}`}
                        />
                    </Column>
                    <Column>
                        <Typography>Thuốc</Typography>
                        <Gauge
                            value={30}
                            startAngle={-110}
                            endAngle={110}
                            sx={{
                                width: 300,
                                height: 200,
                                marginTop: '2rem',
                                marginX: '2rem'
                            }}
                            text={({ value, valueMax }) => `${value} / ${valueMax}`}
                        />
                    </Column>
                    <Box>
                        <Typography>
                            Trạng thái tồn kho
                        </Typography>
                        <Typography>
                            Thức ăn: 15 kg (Cảnh báo: dưới 500 kg)
                        </Typography>
                        <Typography>
                            Vaccine: 30 lọ (Cảnh báo: dưới 100 lọ)
                        </Typography>
                    </Box>
                </Box>

                <BoxBeetwen
                    sx={{
                        background: '#e2e2e2ff',
                        padding: '1rem',
                        borderRadius: '8px',
                        marginTop: '2rem',
                        marginX: '2rem'
                    }}>
                    {/* + Tổng số đàn lợn (lợn con, lợn thịt, lợn nái, lợn đực) */}
                    {role == ROLES.OWNER && <PieChart
                        series={[
                            {
                                data: [
                                    { id: 0, value: 10, label: 'Lợn con' },
                                    { id: 1, value: 15, label: 'Lợn thịt' },
                                    { id: 2, value: 20, label: 'Lợn nái' },
                                    { id: 2, value: 20, label: 'Lợn đực' },
                                ],
                            },
                        ]}
                        width={200}
                        height={200}
                    />}

                    {/* + Tình trạng sức khỏe (khỏe, cần theo dõi, ốm) */}
                    {role == ROLES.OWNER && <PieChart
                        series={[{ innerRadius: 50, outerRadius: 100, data, arcLabel: 'value' }]}
                        {...settings}
                    />}

                    {/* + Tiêm và chưa tiêm */}
                    {role == ROLES.OWNER && <PieChart
                        series={[
                            {
                                data: [
                                    { id: 0, value: 10, label: 'Đã tiêm' },
                                    { id: 1, value: 15, label: 'Chưa tiêm' },
                                ],
                            },
                        ]}
                        width={200}
                        height={200}
                    />}
                </BoxBeetwen>

                {/* + Tăng trưởng trung bình của khu */}
                <BoxBeetwen
                    sx={{
                        background: '#e2e2e2ff',
                        padding: '1rem',
                        borderRadius: '8px',
                        marginTop: '2rem',
                        marginX: '2rem'
                    }}>
                    <LineChart
                        dataset={[1234567890123, 2345678901234].map((timestamp) => ({
                            date: new Date(timestamp),
                            fr: Math.random() * 10000,
                            dl: Math.random() * 10000,
                            gb: Math.random() * 10000,
                        }))
                        }
                        xAxis={[
                            {
                                id: 'Years',
                                dataKey: 'date',
                                scaleType: 'time',
                                valueFormatter: (date) => date.getFullYear().toString(),
                            },
                        ]}
                        yAxis={[{ width: 70 }]}
                        series={[
                            {
                                id: 'France',
                                label: 'French GDP per capita',
                                dataKey: 'fr',
                                stack: 'total',
                                area: true,
                                showMark: false,
                            },
                            {
                                id: 'Germany',
                                label: 'German GDP per capita',
                                dataKey: 'dl',
                                stack: 'total',
                                area: true,
                                showMark: false,
                            },
                            {
                                id: 'United Kingdom',
                                label: 'UK GDP per capita',
                                dataKey: 'gb',
                                stack: 'total',
                                area: true,
                                showMark: false,
                            },
                        ]}
                        experimentalFeatures={{ preferStrictDomainInLineCharts: true }}
                        height={300}
                    />


                    {/* Số lượng thức ăn và vaccine còn tồn trong kho (dual bar chart) */}
                    <BarChart
                        dataset={[
                            { month: 'Jan', thucan: 4000, vaccine: 2400 },
                            { month: 'Feb', thucan: 3000, vaccine: 1398 },
                            { month: 'Mar', thucan: 2000, vaccine: 9800 },
                            { month: 'Apr', thucan: 2780, vaccine: 3908 },
                            { month: 'May', thucan: 1890, vaccine: 4800 },
                            { month: 'Jun', thucan: 2390, vaccine: 3800 },
                            { month: 'Jul', thucan: 3490, vaccine: 4300 },
                        ]}
                        xAxis={[{ dataKey: 'month' }]}
                        series={[
                            { dataKey: 'thucan', label: 'Thức Ăn' },
                            { dataKey: 'vaccine', label: 'Vaccine' },
                        ]}
                        {...chartSetting}
                    />
                </BoxBeetwen>
            </Box>}
            {/* WORKER:
            Widget:
            + Công việc trong tuần
            + Thông báo từ chủ trang trại (vệ sinh chuồng, bổ sung cám, kiểm tra lợn ốm...)
            Card:
            + Các chuồng đang phụ trách ( ấn để xem chuồng) */}
            <Box>
                {role == ROLES.WORKER &&
                    <Box
                        sx={{
                            background: '#e2e2e2ff',
                            padding: '1rem',
                            borderRadius: '8px',
                            marginTop: '2rem',
                            marginX: '2rem',
                            display: 'flex',
                            // alignItems: 'center',
                            justifyContent: 'space-around'
                        }}>
                        <Column sx={{ alignItems: 'center' }}>
                            <Typography>Hiệu suất công việc</Typography>
                            <Gauge
                                value={15}
                                startAngle={-110}
                                endAngle={110}
                                sx={{
                                    width: 300,
                                    height: 200,
                                    marginTop: '2rem',
                                    marginX: '2rem'
                                }}
                                text={({ value, valueMax }) => `${value} / ${valueMax}`}
                            />
                        </Column>
                        <Column sx={{height: '20rem', overflow: 'scroll', }}>
                            <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                                <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                                    <Typography component="span">Thông báo 1</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography>
                                       Công việc: Vệ sinh chuồng A3 vào ngày 20/06/2024
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                        </Column>
                    </Box>}
                {role == ROLES.WORKER &&
                    <Box
                        sx={{
                            background: '#e2e2e2ff',
                            padding: '1rem',
                            borderRadius: '8px',
                            marginTop: '2rem',
                            marginX: '2rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-around'
                        }}>
                        <Column width={'100%'}>
                            <Typography sx={{ marginBottom: '1rem' }}>Các chuồng đang phụ trách</Typography>
                            <Row>
                                <Column gap={'2rem'}>
                                    <Card sx={{ minWidth: 275 }}>
                                        <CardContent>
                                            <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
                                                Word of the Day
                                            </Typography>
                                            <Typography variant="h5" component="div">
                                                be
                                            </Typography>
                                            <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>adjective</Typography>
                                            <Typography variant="body2">
                                                well meaning and kindly.
                                                {'"a benevolent smile"'}
                                            </Typography>
                                        </CardContent>
                                        <CardActions>
                                            <Button size="small">Learn More</Button>
                                        </CardActions>
                                    </Card>

                                    <Card sx={{ minWidth: 275 }}>
                                        <CardContent>
                                            <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
                                                Word of the Day
                                            </Typography>
                                            <Typography variant="h5" component="div">
                                                be
                                            </Typography>
                                            <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>adjective</Typography>
                                            <Typography variant="body2">
                                                well meaning and kindly.
                                                {'"a benevolent smile"'}
                                            </Typography>
                                        </CardContent>
                                        <CardActions>
                                            <Button size="small">Learn More</Button>
                                        </CardActions>
                                    </Card>
                                </Column>
                            </Row>
                        </Column>
                    </Box>}
            </Box>
        </BoxContainer>
    )
}

export default Home;