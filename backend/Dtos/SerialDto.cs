namespace backend.Dtos
{
    public class SerialDto
    {
        public int? Id { get; set; }
        public int? Index { get; set; }
        public int Lesson_ID { get; set; }
        public int? Exam_ID { get; set; }
    }
    public class SerialDtoCreate
    {
        public int? Index { get; set; }
        public int Lesson_ID { get; set; }
        public int? Exam_ID { get; set; }
        public int? Chapter_ID { get; set; }
    }
    public class SerialDtoUpdate : SerialDto
    {
        public int ChapterID { get; set; }
    }
}
