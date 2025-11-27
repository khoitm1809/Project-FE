import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BoxContainer, Column, Row } from '../../components/commonStyled';
import { useDeletePigMutation, useGetDetaiPigQuery } from '../../store/pig/pigAction';
import { Box, Button, Divider, Typography, CircularProgress } from '@mui/material';
import {
    Scale, Calendar, Home, DollarSign, Heart, Clock, TrendingUp, BarChart4,
    Edit, Trash2, FileText, User, CircleDollarSign
} from 'lucide-react';
import { useAddInvoiceMutation } from '../../store/invoice/invoiceApi';
import { ROUTES } from '../../router/routerConstants';


const BoxData = ({ title, number, unit, Icon, color = 'primary' }) => {
    return (
        <Box
            sx={{
                padding: '1.5rem',
                bgcolor: '#ffffff',
                borderLeft: `5px solid`,
                borderColor: (theme) => theme.palette[color].main,
                borderRadius: '8px',
                boxShadow: 3,
                minHeight: '8rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
            }}
        >
            <Row sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: '600', color: '#555' }}>
                    {title}
                </Typography>
                {Icon && <Icon size={24} color="#aaa" />}
            </Row>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 1, color: (theme) => theme.palette[color].dark }}>
                {number || 'N/A'}
                <span style={{ fontSize: '1rem', fontWeight: 'normal', marginLeft: '0.5rem' }}>{unit}</span>
            </Typography>
        </Box>
    );
};

const formatDateTime = (isoString) => {
    if (!isoString) return 'N/A';
    const date = new Date(isoString);
    return date.toLocaleDateString('vi-VN') + ' ' + date.toLocaleTimeString('vi-VN').substring(0, 5);
};

export const formatCurrency = (number) => {
    if (!number || isNaN(number)) return '0';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
};

// Hàm tính số ngày nuôi
const calculateDaysLived = (createdAt) => {
    if (!createdAt) return 0;
    const createdDate = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - createdDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export function DetailPig() {
    const location = useLocation();
    const navigate = useNavigate();
    const pigId = location.state;
    // const [editPig] = useEditPigMutation(); // Chưa dùng đến, có thể ẩn
    const [deletePig] = useDeletePigMutation();
    const [addInvoice] = useAddInvoiceMutation();

    const {
        data,
        isLoading,
        isError,
    } = useGetDetaiPigQuery(
        { pigId: pigId },
        { refetchOnMountOrArgChange: true }
    );

    const handleDelete = () => {
        deletePig({ id: pigId })
            .unwrap()
            .then(() => {
                navigate(ROUTES.PIG_PAGE);
            })
            .catch((error) => {
                alert('Xóa thất bại.');
            });
    };

    if (isLoading) {
        return (
            <BoxContainer padding={'2rem'} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                <CircularProgress />
            </BoxContainer>
        );
    }

    if (isError || !data || !data.data) {
        return (
            <BoxContainer padding={'2rem'} sx={{ textAlign: 'center' }}>
                <Typography variant="h5" color="error">Không tìm thấy thông tin heo hoặc có lỗi xảy ra.</Typography>
                <Button variant="contained" onClick={() => navigate('/pigs')} sx={{ mt: 2 }}>Quay lại danh sách</Button>
            </BoxContainer>
        );
    }

    const pigDetail = data.data; // Giả định cấu trúc data: { data: { ... } }

    // --- LOGIC TÍNH TOÁN (ĐÃ SỬA THEO YÊU CẦU) ---

    const latestWeightRecord = [...pigDetail.pig_growth_records]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

    const initialWeight = parseFloat(pigDetail?.weight) || 0;
    const currentWeight = latestWeightRecord?.weight || initialWeight;

    // Giá nhập ban đầu (tổng tiền nhập)
    const totalInitialPrice = parseFloat(pigDetail?.price) || 0;

    // Giá 1 kg lúc nhập
    const initialPricePerKg =
        initialWeight > 0 ? totalInitialPrice / initialWeight : 0;

    // Số ngày nuôi
    const daysLived = calculateDaysLived(pigDetail?.createdAt);

    // Số kg tăng/giảm
    const weightDiff = currentWeight - initialWeight;

    // Lãi/Lỗ theo kg
    const profit = weightDiff * initialPricePerKg;

    // Format hiển thị (thêm dấu trừ nếu lỗ)
    const profitDisplay =
        profit < 0
            ? `-${formatCurrency(Math.abs(profit))}`
            : formatCurrency(profit);



    const handleExport = () => {
        if (!data || !data.data) {
            alert('Không có dữ liệu heo để xuất chuồng.');
            return;
        }

        const pigDetail = data.data;

        const invoicePayload = {
            pigCode: pigDetail.pigCode,
            weight: currentWeight,
            age: pigDetail.age,
            note: pigDetail.note,
            price: totalInitialPrice,
            users_permissions_user: pigDetail.users_permissions_user?.documentId,
        };

        addInvoice(invoicePayload)
            .unwrap()
            .then((invoiceResponse) => {
                const newInvoiceId = invoiceResponse?.data?.id;

                return deletePig(pigId)
                    .unwrap()
                    .then(() => {
                        navigate(ROUTES.INVOICE, {
                            state: newInvoiceId,
                        });
                    });
            })
            .catch((error) => {
                console.error('Lỗi quy trình xuất chuồng:', error);
                // Kiểm tra lỗi để báo cho người dùng biết lỗi ở bước nào
                // if (error.status === 400) {
                //     alert('Lỗi tạo hóa đơn (kiểm tra các trường dữ liệu bắt buộc).');
                // } else if (error.status === 500) {
                //     alert('Lỗi server khi xóa heo hoặc tạo hóa đơn.');
                // } else {
                //     alert('Lỗi xuất chuồng không xác định.');
                // }
            });
    };

    return (
        <BoxContainer padding={'2rem'} sx={{ width: '100%', background: '#f0f0f0', minHeight: '100vh' }}>
            <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 'bold', color: '#1976d2' }}>
                Chi Tiết Heo: {pigDetail.pigCode}
            </Typography>
            <Row sx={{
                display: 'flex',
                gap: '2rem',
                justifyContent: 'center',
                alignItems: 'flex-start',
                '@media (max-width: 1249px)': {
                    flexDirection: 'column',
                    alignItems: 'stretch',
                },
            }}>
                {/* 1. CỘT 1: Thông tin chi tiết (60%) */}
                <Column sx={{
                    width: '60%',
                    borderRadius: '1rem',
                    background: 'white',
                    boxShadow: 5,
                    p: 3,
                    '@media (max-width: 1249px)': { width: '100%' }
                }}>
                    <Typography variant="h5" sx={{ mb: 2, fontWeight: '700', color: '#333' }}>
                        Thông tin cơ bản
                    </Typography>
                    <Divider sx={{ mb: 2 }} />

                    {[
                        { label: 'Mã số', value: pigDetail?.pigCode, Icon: null },
                        { label: 'Loại giống', value: pigDetail?.pig_type?.name, Icon: FileText },
                        { label: 'Tuổi', value: `${pigDetail?.age} tháng`, Icon: Calendar },
                        { label: 'Cân nặng ban đầu', value: `${initialWeight} kg`, Icon: Scale },
                        { label: 'Chuồng', value: pigDetail?.barn?.name, Icon: Home },
                        { label: 'Trạng thái SK', value: pigDetail?.healthStatus ? 'Khỏe Mạnh' : 'Cần Theo Dõi', Icon: Heart, color: pigDetail?.healthStatus ? 'success' : 'error' },
                        { label: 'Giá nhập (ước tính)', value: formatCurrency(initialPricePerKg), Icon: DollarSign, color: 'info' },
                        { label: 'Người tạo hồ sơ', value: pigDetail?.users_permissions_user?.username, Icon: User },
                        { label: 'Ngày nhập', value: formatDateTime(pigDetail?.createdAt), Icon: Clock },
                    ].map((item, index) => (
                        <Column key={index}>
                            <Row sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: '1px dotted #eee', alignItems: 'center' }}>
                                <Typography variant="body1" sx={{ fontWeight: '500', display: 'flex', alignItems: 'center', gap: 1 }}>
                                    {item.Icon && <item.Icon size={18} color="#777" />} {item.label}
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: '600', color: item.color ? (theme) => theme.palette[item.color].main : '#333' }}>
                                    {item.value || 'N/A'}
                                </Typography>
                            </Row>
                        </Column>
                    ))}

                    <Typography variant="h6" sx={{ mt: 3, mb: 1, fontWeight: '700', color: '#333' }}>
                        Ghi chú
                    </Typography>
                    <Box sx={{ p: 2, bgcolor: '#fafafa', borderRadius: '4px', border: '1px solid #ddd' }}>
                        <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#555' }}>
                            {pigDetail?.note || 'Không có ghi chú.'}
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<Edit size={20} />}
                        sx={{ mt: 3 }}
                        onClick={() => navigate(`/edit-pig/${pigId}`, { state: pigId })}
                    >
                        Chỉnh Sửa Thông Tin
                    </Button>
                </Column>

                {/* 2. CỘT 2: Thông số thống kê & Hành động (35%) */}
                <Column sx={{ width: '35%', gap: '1rem', '@media (max-width: 1249px)': { width: '100%' } }}>
                    <BoxData
                        title={'Cân nặng hiện tại'}
                        number={currentWeight}
                        unit={"kg"}
                        Icon={Scale}
                        color={'info'}
                    />
                    <BoxData
                        title={'Số ngày nuôi'}
                        number={daysLived}
                        unit={"Ngày"}
                        Icon={Clock}
                        color={'secondary'}
                    />
                    <BoxData
                        title={'Tăng trọng'}
                        number={weightDiff > 0 ? `+${weightDiff}` : weightDiff}
                        unit={"kg"}
                        Icon={TrendingUp}
                        color={weightDiff > 0 ? 'success' : 'warning'}
                    />

                    <BoxData
                        title={'Lãi / Lỗ'}
                        number={profitDisplay}
                        unit={"VND"}
                        Icon={BarChart4}
                        color={profit >= 0 ? 'success' : 'error'}
                    />

                    {/* Nút Xóa Hồ Sơ */}
                    <Button
                        variant="contained"
                        color="error"
                        startIcon={<Trash2 size={20} />}
                        sx={{ mt: 0 }}
                        fullWidth
                        onClick={handleDelete}
                    >
                        Xóa Hồ Sơ Heo
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<CircleDollarSign size={20} />}
                        fullWidth
                        onClick={handleExport}
                    >
                        Xuất chuồng
                    </Button>
                </Column>
            </Row>
        </BoxContainer>
    );
}