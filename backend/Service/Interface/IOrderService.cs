using backend.Base;
using backend.Dtos;

namespace backend.Service.Interface
{
    public interface IOrderService
    {
        Task<object> CreateOrder(CreateOrder order);
        Task<object> ConfirmPayment(ConfirmPayment confirmPayment);
        Task<object> GetAllOrder();
        Task<object> InsertSourceFree(InsertSourceFree insertSourceFree);
        Task<object> GetAllOrderPagination(int PageIndex = 1, int PageSize = 10);
        /*        Task<Order> GetOrder(int id);
Task<Order> UpdateOrder(int id, Order order);
Task<Order> DeleteOrder(int id);
Task<Order> ConfirmPayment(ConfirmPayment payment);*/
    }
}
