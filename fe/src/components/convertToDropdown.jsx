export const convertToDropdown = (list) => {
    if (!list || !Array.isArray(list)) {
        return [];
    }

    return list?.map((item) => ({
        // Lấy ID làm giá trị (value), đảm bảo chuyển thành chuỗi (String)
        value: String(item?.id),
        // Lấy tên chuồng làm nhãn hiển thị (label)
        label: item?.name,
    }));
};