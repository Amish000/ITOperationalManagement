using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Globalization;
using System.Net;
using System.Security.Cryptography;
using System.Text;

namespace ITAdministrationApp.Helpers
{
    public static class ApiResultHelper
    {
        private const string RESPONSE_SIGNATURE_HEADER_KEY = "RESPONSE-SIGNATURE";
        private const string CACHED_DATA_UNCHANGED_HEADER = "CACHED_DATA_UNCHANGED";

        public static string FilePath = string.Empty;

        public static object CreateApiResult(this ControllerBase controller, bool success, object result = null, string message = "", int totalData = 0, HttpStatusCode statusCode = HttpStatusCode.OK)
        {
            string previousResponseSignature = string.Empty;
            string serializedResult = JsonConvert.SerializeObject(
                result,
                Formatting.Indented,
                new JsonSerializerSettings()
                {
                    ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
                }
                );
            string newResponseSignature = result == null ? string.Empty : GetHashString(serializedResult);

            if (controller.Request.Headers.ContainsKey(RESPONSE_SIGNATURE_HEADER_KEY))
            {
                previousResponseSignature = controller.Request.Headers[RESPONSE_SIGNATURE_HEADER_KEY];
            }

            if (!string.IsNullOrWhiteSpace(previousResponseSignature) && !string.IsNullOrWhiteSpace(newResponseSignature) && string.Equals(previousResponseSignature, newResponseSignature, System.StringComparison.InvariantCultureIgnoreCase) && !controller.Response.Headers.ContainsKey(CACHED_DATA_UNCHANGED_HEADER))
            {
                controller.Response.Headers.Add(CACHED_DATA_UNCHANGED_HEADER, string.Empty);
            }
            else if (!controller.Response.Headers.ContainsKey(RESPONSE_SIGNATURE_HEADER_KEY))
            {
                controller.Response.Headers.Add(RESPONSE_SIGNATURE_HEADER_KEY, newResponseSignature);
            }

            controller.Response.StatusCode = (int)statusCode;

            return new
            {
                Success = success,
                Result = result,
                TotalData = totalData,
                Message = message
            };
        }

        public static object CreateApiResultForException(this ControllerBase controller, bool success, object result = null, string message = "")
        {
            return CreateApiResult(controller, success, result, message, 0, HttpStatusCode.InternalServerError);
        }

        public static object CreateApiResult(this ControllerBase controller, bool success, MessageTypes messageType, string entity, object result = null, int totalData = 0, HttpStatusCode statusCode = HttpStatusCode.OK)
        {
            var responseMessage = ResponseMessage(entity, messageType);
            return CreateApiResult(controller, success, result, responseMessage, totalData, statusCode);
        }

        public static object CreateApiResultForException(this ControllerBase controller, bool success, MessageTypes messageType, string entity, object result = null, int totalData = 0)
        {
            var responseMessage = ResponseMessage(entity, messageType);
            return CreateApiResult(controller, success, result, responseMessage, totalData, HttpStatusCode.InternalServerError);
        }

        public static object CreateCourseComponentUnauthorizedResult(this ControllerBase controller)
        {
            return CreateApiResult(controller, false, message: "You are not authorized to view this content!", statusCode: HttpStatusCode.Unauthorized);
        }

        public static object CreateUnauthorizedResult(this ControllerBase controller)
        {
            return CreateApiResult(controller, false, message: "You are not authorized to make this request!", statusCode: HttpStatusCode.Unauthorized);
        }

        public static byte[] GetHash(string inputString)
        {
            HashAlgorithm algorithm = SHA256.Create();
            return algorithm.ComputeHash(Encoding.UTF8.GetBytes(inputString));
        }

        public static string GetHashString(string inputString)
        {
            StringBuilder sb = new StringBuilder();
            foreach (byte b in GetHash(inputString))
                sb.Append(b.ToString("X2"));

            return sb.ToString();
        }

        public static object CreateRestfulHandlerResponse(bool success, string message, object result = null)
        {
            return new { Message = message, Payload = result, Title = string.Empty, Success = success };
        }

        private static string ResponseMessage(string entity, MessageTypes titleTypes)
        {
            TextInfo textInfo = new CultureInfo("en-US", false).TextInfo;
            switch (titleTypes)
            {
                case MessageTypes.Added:
                    return string.Format("{0} added successfully.", textInfo.ToTitleCase(entity));

                case MessageTypes.FailedToAdd:
                    return string.Format("Failed to add new {0}.", textInfo.ToLower(entity));

                case MessageTypes.Updated:
                    return string.Format("{0} updated successfully.", textInfo.ToTitleCase(entity));

                case MessageTypes.Removed:
                    return string.Format("{0} removed successfully.", textInfo.ToTitleCase(entity));

                case MessageTypes.Published:
                    return string.Format("{0} published successfully.", textInfo.ToTitleCase(entity));

                case MessageTypes.FailedToUpdate:
                    return string.Format("Failed to update existing {0}.", textInfo.ToLower(entity));

                case MessageTypes.Deleted:
                    return string.Format("{0} deleted successfully.", textInfo.ToTitleCase(entity));

                case MessageTypes.FailedToDelete:
                    return string.Format("Failed to delete existing {0}.", textInfo.ToLower(entity));

                case MessageTypes.Retrieved:
                    return string.Format("{0} retrieved successfully.", textInfo.ToTitleCase(entity));

                case MessageTypes.FailedToRetrieve:
                    return string.Format("Failed to retrieve {0}.", textInfo.ToLower(entity));

                case MessageTypes.AlreadyExist:
                    return string.Format("{0} already exists.", textInfo.ToTitleCase(entity));

                case MessageTypes.PackageAlreadyUsed:
                    return string.Format("{0} already purchased or requested cannot be unpublished.", textInfo.ToTitleCase(entity));

                case MessageTypes.DoesntExist:
                    return string.Format("{0} doesn't exist.", textInfo.ToTitleCase(entity));

                case MessageTypes.LoggedIn:
                    return string.Format("{0} logged in successfully.", textInfo.ToTitleCase(entity));

                case MessageTypes.FailedLogin:
                    return string.Format("{0} log in unsuccessful.", textInfo.ToTitleCase(entity));

                case MessageTypes.Appoved:
                    return string.Format("{0} approved Successfully.", textInfo.ToTitleCase(entity));

                case MessageTypes.Rejected:
                    return string.Format("{0} rejected Successfully.", textInfo.ToTitleCase(entity));

                case MessageTypes.PaymentSuccess:
                    return string.Format("{0} Payment Successfully.", textInfo.ToTitleCase(entity));

                case MessageTypes.NoCreditLimit:
                    return string.Format("{0} You Have No credit.", textInfo.ToTitleCase(entity));

                case MessageTypes.FailedPayment:
                    return string.Format("{0} Payment Failed.", textInfo.ToTitleCase(entity));

                case MessageTypes.UserNotFound:
                    return string.Format("{0} User Not Found.", textInfo.ToTitleCase(entity));

                case MessageTypes.AlreadyExistStudyPlan:
                    return string.Format("{0} Sorry!You have planned for another subject at that Time.", textInfo.ToTitleCase(entity));

                case MessageTypes.RegisterSuccess:
                    return string.Format("Confirmation link has been sent to your email address.", textInfo.ToTitleCase(""));

                case MessageTypes.FailedToVerifyEmail:
                    return string.Format("This email is not verified.");

                case MessageTypes.CouldNotFountAccount:
                    return string.Format("This email is not registered.");

                case MessageTypes.CourseApprove:
                    return string.Format("Course has been approved successfully!!!", textInfo.ToTitleCase(""));

                case MessageTypes.AlreadyCourseApprove:
                    return string.Format("Course already approved!!!", textInfo.ToTitleCase(""));

                case MessageTypes.CourseRejected:
                    return string.Format("Course has been rejected!!!", textInfo.ToTitleCase(""));

                case MessageTypes.FailedCourseApprove:
                    return string.Format("Failed to approve course!!!", textInfo.ToTitleCase(""));

                case MessageTypes.FailedCourseReject:
                    return string.Format("Failed to reject course!!!", textInfo.ToTitleCase(""));

                case MessageTypes.FailedToVerifyLink:
                    return string.Format("Failed to Verify {0}", textInfo.ToTitleCase(""));

                case MessageTypes.LinkVerifiedSuccess:
                    return string.Format("{0} Verified Successfully.", textInfo.ToTitleCase(""));

                case MessageTypes.AlreadyCourseUnpublished:
                    return string.Format("Course already Unpublished!!!", textInfo.ToTitleCase(""));

                case MessageTypes.CourseUnpublished:
                    return string.Format("Course has been unpublished and email sent to instructor", textInfo.ToTitleCase(""));

                case MessageTypes.FailedToUnpublishCourse:
                    return string.Format("Failed to unpublish {0}", textInfo.ToTitleCase(""));

                case MessageTypes.UnauthorizedToAccess:
                    return string.Format("You are Unauthorized to access this {0}", textInfo.ToTitleCase(entity));

                case MessageTypes.RequestedForRepublish:
                    return string.Format("Course has been requested for republish", textInfo.ToTitleCase(""));

                case MessageTypes.FailedToRequestForRepublish:
                    return string.Format(" Failed to request for republish", textInfo.ToTitleCase(""));

                case MessageTypes.AlreadyRegistered:
                    return string.Format(" Account already registered with this {0}", textInfo.ToTitleCase(entity));

                case MessageTypes.FailedToSendVerifyLink:
                    return string.Format(" Failed to send Verification Link", textInfo.ToTitleCase(""));

                case MessageTypes.VerificationLinkSent:
                    return string.Format("Verification Link sent to Email.", textInfo.ToTitleCase(""));

                case MessageTypes.InvalidDataProvided:
                    return string.Format("Invalid data provided", textInfo.ToTitleCase(""));

                default:
                    return "";
            }
        }

        public enum MessageTypes
        {
            Added,
            FailedToAdd,
            Updated,
            Removed,
            FailedToUpdate,
            Deleted,
            FailedToDelete,
            Retrieved,
            FailedToRetrieve,
            AlreadyExist,
            DoesntExist,
            LoggedIn,
            FailedLogin,
            Rejected,
            Appoved,
            PaymentSuccess,
            NoCreditLimit,
            FailedPayment,
            UserNotFound,
            AlreadyExistStudyPlan,
            PackageAlreadyUsed,
            Published,
            RegisterSuccess,
            FailedToVerifyEmail,
            CouldNotFountAccount,
            CourseApprove,
            AlreadyCourseApprove,
            CourseRejected,
            FailedCourseApprove,
            FailedCourseReject,
            FailedToVerifyLink,
            LinkVerifiedSuccess,
            CourseUnpublished,
            AlreadyCourseUnpublished,
            FailedToUnpublishCourse,
            UnauthorizedToAccess,
            RequestedForRepublish,
            FailedToRequestForRepublish,
            AlreadyRegistered,
            FailedToSendVerifyLink,
            VerificationLinkSent,
            InvalidDataProvided
        }

        public static async Task<ContentResult> GetUnauthorizedResultAsync(string baseAddress)
        {
            return await HttpRequestHelper.GetContentResultAsync(baseAddress, HttpStatusCode.Unauthorized, "Unauthorized", "You are unauthorized to view this content.");
        }

        public static async Task<ContentResult> GetFailureResultAsync(string baseAddress)
        {
            return await HttpRequestHelper.GetContentResultAsync(baseAddress, HttpStatusCode.InternalServerError, "Failure", "Failed to load content.");
        }

        public static async Task<ContentResult> GetNotFoundResultAsync(string baseAddress)
        {
            return await HttpRequestHelper.GetContentResultAsync(baseAddress, HttpStatusCode.NotFound, "Failure", "Content not found.");
        }

        public static object CreateDeprecatedApiError(this ControllerBase controller)
        {
            return CreateApiResult(controller, false, message: "This feature is supported in newer versions only. Please upgrade your app.");
        }
    }
}
