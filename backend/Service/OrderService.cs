using backend.Data;
using backend.Dtos;
using backend.Entities;
using backend.Service.Interface;
using static Nest.JoinField;
using System.Xml;
using System.Text.Json.Serialization;
using Newtonsoft.Json;
using Microsoft.EntityFrameworkCore;
using backend.Base;

namespace backend.Service
{
    public class OrderService : IOrderService
    {
        private LMSContext _context;
        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IimageServices _imageServices;
        private readonly ICartService _cartServices;

        public OrderService(LMSContext context,ICartService cartService ,IConfiguration configuration, IimageServices imageServices, IHttpContextAccessor httpContextAccessor)        {
            _context = context;
            _configuration = configuration;
            _httpContextAccessor = httpContextAccessor;
            _imageServices = imageServices;
            _cartServices = cartService;
        }
        public async Task<object> CreateOrder(CreateOrder Order)
        {
            /*var request = _httpContextAccessor.HttpContext.Request;
            string baseUrl = $"{request.Scheme}://{request.Host}";*/

            //Kiểm tra UserID 
            var user = await _context.Users.FindAsync(Order.UserID);
            if (user == null)
            {
                return new
                {
                    message = "User not found"
                };
            }
            //Tạo Order
            string vnp_Returnurl = Order.PortURLreturn + _configuration["VNPAY:vnp_Returnurl"]; //URL nhan ket qua tra ve 
            string vnp_Url = _configuration["VNPAY:vnp_Url"]; //URL thanh toan cua VNPAY 
            string vnp_TmnCode = _configuration["VNPAY:vnp_TmnCode"]; //Ma định danh merchant kết nối (Terminal Id)
            string vnp_HashSecret = _configuration["VNPAY:vnp_HashSecret"]; //Secret Key 
           
         
            VnPayLibrary vnpay = new VnPayLibrary();

            vnpay.AddRequestData("vnp_Version", VnPayLibrary.VERSION);
            vnpay.AddRequestData("vnp_Command", "pay");
            vnpay.AddRequestData("vnp_TmnCode", vnp_TmnCode);
            vnpay.AddRequestData("vnp_Amount", (Order.TotalPrice * 100).ToString()); //Số tiền thanh toán. Số tiền không mang các ký tự phân tách thập phân, phần nghìn, ký tự tiền tệ. Để gửi số tiền thanh toán là 100,000 VND (một trăm nghìn VNĐ) thì merchant cần nhân thêm 100 lần (khử phần thập phân), sau đó gửi sang VNPAY là: 10000000
            vnpay.AddRequestData("vnp_BankCode", "VNBANK");
            vnpay.AddRequestData("vnp_CreateDate", Order.CreateAt.ToString("yyyyMMddHHmmss"));
            vnpay.AddRequestData("vnp_CurrCode", "VND");
            vnpay.AddRequestData("vnp_IpAddr", "13.160.92.202");

            vnpay.AddRequestData("vnp_Locale", "vn");
            vnpay.AddRequestData("vnp_OrderInfo", "abc");
            vnpay.AddRequestData("vnp_OrderType", "other"); //default value: other

            vnpay.AddRequestData("vnp_ReturnUrl", vnp_Returnurl);
            vnpay.AddRequestData("vnp_TxnRef", DateTime.Now.Ticks.ToString()); // Mã tham chiếu của giao dịch tại hệ thống của merchant. Mã này là duy nhất dùng để phân biệt các đơn hàng gửi sang VNPAY. Không được trùng lặp trong ngày

            string paymentUrl = vnpay.CreateRequestUrl(vnp_Url, vnp_HashSecret);

            return new
            {
                message = "Success",
                paymentUrl = paymentUrl
            };
        }
        public async Task<object> ConfirmPayment(ConfirmPayment confirmPayment)
        {
            string vnp_HashSecret = _configuration["VNPAY:vnp_HashSecret"];
            VnPayLibrary vnpay = new VnPayLibrary();
            vnpay.AddResponseData("vnp_Amount", confirmPayment.vnp_Amount.ToString());
            vnpay.AddResponseData("vnp_BankCode", confirmPayment.vnp_BankCode);
            vnpay.AddResponseData("vnp_BankTranNo", confirmPayment.vnp_BankTranNo);
            vnpay.AddResponseData("vnp_CardType", confirmPayment.vnp_CardType);
            vnpay.AddResponseData("vnp_OrderInfo", confirmPayment.vnp_OrderInfo);
            vnpay.AddResponseData("vnp_PayDate", confirmPayment.vnp_PayDate);
            vnpay.AddResponseData("vnp_ResponseCode", confirmPayment.vnp_ResponseCode);
            vnpay.AddResponseData("vnp_TmnCode", confirmPayment.vnp_TmnCode);
            vnpay.AddResponseData("vnp_TransactionNo", confirmPayment.vnp_TransactionNo);
            vnpay.AddResponseData("vnp_TransactionStatus", confirmPayment.vnp_TransactionStatus);
            vnpay.AddResponseData("vnp_TxnRef", confirmPayment.vnp_TxnRef.ToString());
            vnpay.AddResponseData("vnp_SecureHash", confirmPayment.vnp_SecureHash);

            bool checkSignature = vnpay.ValidateSignature(confirmPayment.vnp_SecureHash, vnp_HashSecret);
            if (checkSignature)
            {
                if (confirmPayment.vnp_ResponseCode == "00" && confirmPayment.vnp_TransactionStatus == "00")
                {
                    string key = string.Format(CreateCacheKey.CartKey, confirmPayment.UserID);
                    var listCart = await _cartServices.GetCartListByKey(key);
                    if (listCart.Count == 0)
                    {
                        return new
                        {
                            message = "Thất bại"
                        };
                    }

                    List<Order> payment = new List<Order>();
                    foreach (var car in listCart)
                    {
                        Order order = new Order();
                        order.UserID = (int)car.Userid;
                        order.SouresID = (int)car.SourceId;
                        order.TotalPrice = (double)car.Price;
                        order.Status = true;
                        order.PaymentID = confirmPayment.vnp_TxnRef.ToString();
                        payment.Add(order);
                    }

                    _context.Orders.AddRange(payment); 
                    await _context.SaveChangesAsync(); 
                    await _cartServices.DeleteAllCart(confirmPayment.UserID);

                    return new
                    {
                        message = "Success"
                    };
                }
                else
                {
                    return new
                    {
                        message = "Thất bại"
                    };
                }
            }
            return new
            {
                message = "Thất bại"
            };
        }

        public async Task<object> GetAllOrder()
        {
            var result = (from order in _context.Orders
                          join source in _context.Sources on order.SouresID equals source.Id
                          group new { order, source } by new { order.SouresID, source.Title, source.Price ,source.Thumbnail,source.Description } into grouped
                          select new
                          {
                              SouresID = grouped.Key.SouresID,
                              TotalPrice = grouped.Sum(x => x.order.TotalPrice),
                              TotalOrders = grouped.Count(),
                              SourceTitle = grouped.Key.Title,
                              SourcePrice = grouped.Key.Price,
                              Orders = grouped.Select(x => x.order).ToList(),
                              Thumbbnail = _imageServices.GetFile( grouped.Key.Thumbnail) ,
                              Description = grouped.Key.Description
                          })
                    .OrderByDescending(x => x.TotalPrice)
                    .ToList();

            return result;
        }
        public async Task<object> GetAllOrderPagination(int PageIndex = 1, int PageSize = 10)
        {
            var result =await (from order in _context.Orders
                          join source in _context.Sources on order.SouresID equals source.Id
                          join subTopic in _context.SubTopics on source.SubTopicId equals subTopic.Id
                          join topic in _context.Topics on subTopic.TopicId equals topic.Id
                          group new { order, source} by new { order.SouresID, source.Title, source.Price, source.Thumbnail, source.Description , topic.TopicName} into grouped
                          select new
                          {
                              SouresID = grouped.Key.SouresID,
                              TotalPrice = grouped.Sum(x => x.order.TotalPrice),
                              TotalOrders = grouped.Count(),
                              SourceTitle = grouped.Key.Title,
                              SourcePrice = grouped.Key.Price,
                              Orders = grouped.Select(x => x.order).ToList(),
                              Thumbbnail = _imageServices.GetFile(grouped.Key.Thumbnail),
                              Description = grouped.Key.Description,
                              TopicName = grouped.Key.TopicName
                          })
                    .OrderByDescending(x => x.TotalPrice)
                    .Skip(PageSize*(PageIndex -1))
                    .Take(PageSize)
                    .ToListAsync();

            return result;
        }

        public async Task<object> InsertSourceFree(InsertSourceFree insertSourceFree)
        {
            var Order = new Order
            {
                UserID = insertSourceFree.UserID,
                SouresID = insertSourceFree.SourceID,
                TotalPrice = 0,
                CreatedAt = DateTime.Now,
                PaymentID = "",
                Status = true
            };
            await _context.Orders.AddAsync(Order);
            await _context.SaveChangesAsync();
            return Order;
        }
        /*     public async Task<object> UpdateOrder(int id)
{
var order = _context.Orders.FirstOrDefault(x => x.Id == id);
if (order == null) return null;
ỏ
_context.Orders.Update(order);
if (order == null)
{
   return new
   {
       message = "Order not found"
   };
}
return order;
}*/

    }
}
