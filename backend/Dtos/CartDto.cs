namespace backend.Dtos
{
    public class CartDto
    {
        public string Username { get; set; }
        public int Userid { get; set; }
        public string Email { get; set; }
        public double TotalPrice { get; set; }
        public List<SourceCart> Sources { get; set; } 
    }
    public class SourceCart
    {
        public string Thumbnail { get; set; }
        public string SourceName { get; set; }
        public int SourceID { get; set; }
        public double Price { get; set; }
    }
}
