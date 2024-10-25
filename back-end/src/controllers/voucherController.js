const { createDiscount, getAllDiscounts, getDiscountByCode, updateDiscount, deleteDiscount} = require("../services/voucherService");

// Tạo mới discount
const createDiscountController = async (req, res) => {
try {
    const { code, name, discount_val, discount_perc, min_order_val, desc, stock, is_active } = req.body;
    const newDiscount = await createDiscount({ code, name, discount_val, discount_perc, min_order_val, desc, stock, is_active });
    res.status(201).json({
    message: "Discount created successfully",
    data: newDiscount
    });
} catch (error) {
    res.status(500).json({ error: error.message });
}
};

// Lấy tất cả các discount hiện có
const getAllDiscountsController = async (req, res) => {
try {
    const discounts = await getAllDiscounts();
    res.status(200).json({
    message: "Success",
    data: discounts
    });
} catch (error) {
    res.status(500).json({ error: error.message });
}
};

// Lấy discount theo code
const getDiscountByCodeController = async (req, res) => {
try {
    const { code } = req.params;
    const discount = await getDiscountByCode(code);
    res.status(200).json({
    message: "Success",
    data: discount
    });
} catch (error) {
    res.status(404).json({ error: error.message });
}
};

// Cập nhật discount 
const updateDiscountController = async (req, res) => {
try {
    const { id } = req.params;
    const { code, name, discount_val, discount_perc, min_order_val, desc, stock, is_active } = req.body;

    const updatedDiscount = await updateDiscount(id, { code, name, discount_val, discount_perc, min_order_val, desc, stock, is_active });
    res.status(200).json({
    message: "Discount updated successfully",
    data: updatedDiscount
    });
} catch (error) {
    res.status(500).json({ error: error.message });
}
};

// Xóa discount 
const deleteDiscountController = async (req, res) => {
try {
    const { id } = req.params;
    const result = await deleteDiscount(id);
    res.status(200).json({
    message: result.message
    });
} catch (error) {
    res.status(500).json({ error: error.message });
}
};

module.exports = {
createDiscountController,
getAllDiscountsController,
getDiscountByCodeController,
updateDiscountController,
deleteDiscountController
};
