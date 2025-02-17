using backend.Base;
using backend.Dtos;
using backend.Service;
using backend.Service.Interface;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController
    {
        private readonly IOrderService _orderService;
        public OrderController(IOrderService orderService)
        {
            _orderService = orderService;
        }
        [HttpPost("create-order")]
        public async Task<object> CreateOrder(CreateOrder order)
        {
            return await _orderService.CreateOrder(order);
        }
        [HttpPost("confirm-payment")]
        public async Task<object> ConfirmPayment(ConfirmPayment confirmPayment2)
        {
            return await _orderService.ConfirmPayment(confirmPayment2);
        }
        [HttpGet("get-all-order")]
        public async Task<object> GetAllOrder()
        {
            return await _orderService.GetAllOrder();
        }
        [HttpGet("get-all-order-pagination")]
        public async Task<object> GetAllOrderPagination(int PageIndex = 1, int PageSize = 10)
        {
            return await _orderService.GetAllOrderPagination(PageIndex,PageSize);
        }
        [HttpPost("insert-source-free")]
        public async Task<object> InsertSourceFree(InsertSourceFree insertSourceFree)
        {
            return await _orderService.InsertSourceFree(insertSourceFree);
        }
    }
}
