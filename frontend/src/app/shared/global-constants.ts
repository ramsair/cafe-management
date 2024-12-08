export class GlobalConstants {
    // Messages
    public static genericError: string = "Something went wrong, please try again later.";

    public static unauthorized:string="You are not authorized person to access this page.";
    public static productExistError:string="Product Already Exist";
    public static productAdded:string="Product Added Successfully";




    // Regular Expressions
    public static nameRegex: string = "^[a-zA-Z0-9 ]*$"; // Allowing letters, numbers, and spaces
    public static emailRegex: string = "^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\\.[a-z]{2,3}$"; // Valid email pattern
    public static contactNumberRegex: string = "^[0-9]{10}$"; // 10-digit contact numbers

    // Variables
    public static error: string = "error";
}
