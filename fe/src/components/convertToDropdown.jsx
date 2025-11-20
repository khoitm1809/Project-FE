export const convertToDropdown = (list) => {
    if (!list || !Array.isArray(list)) {
        return [];
    }

    return list?.map((barn) => ({
        // Lấy ID làm giá trị (value), đảm bảo chuyển thành chuỗi (String)
        value: String(barn?.id),
        // Lấy tên chuồng làm nhãn hiển thị (label)
        label: barn?.name,
    }));
};