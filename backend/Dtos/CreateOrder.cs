namespace backend.Dtos
{
    public class CreateOrder
    {
        public int UserID { get; set; }
        public DateTime CreateAt { get; set; } = DateTime.Now;
        public string PortURLreturn { get; set; }
        public double TotalPrice { get; set; }
    }
    public class ConfirmPayment
    {
        public long? vnp_Amount { get; set; }
        public string? vnp_BankCode { get; set; }
        public string? vnp_BankTranNo { get; set; }
        public string? vnp_CardType { get; set; }
        public string vnp_OrderInfo { get; set; }
        public string? vnp_PayDate { get; set; }
        public string? vnp_ResponseCode { get; set; }
        public string? vnp_TmnCode { get; set; }
        public string? vnp_TransactionNo { get; set; }
        public string? vnp_TransactionStatus { get; set; }
        public long vnp_TxnRef { get; set; }
        public string? vnp_SecureHash { get; set; }
        public int UserID { get; set; }
    }
    public class InsertSourceFree
    {
        public int UserID { get; set; }
        public int SourceID { get; set; }
    }
}
