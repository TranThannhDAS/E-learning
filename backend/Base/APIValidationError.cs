namespace backend.Base
{
    public class APIValidationError : BaseResult
    {
        public APIValidationError() : base(400)
        {

        }
        public IEnumerable<string> Errors { get; set; } = [];
    }
}
