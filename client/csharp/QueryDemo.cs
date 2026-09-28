// Console app: QUERY method via HttpClient (RFC 10008)
// Server pehle: node server/index.js
//
//   dotnet new console -n QueryClient
//   is file ka Main QueryClient/Program.cs me copy

using System.Net.Http.Headers;
using System.Text;

const string baseUrl = "http://127.0.0.1:3008";

using var http = new HttpClient();

var options = new HttpRequestMessage(HttpMethod.Options, baseUrl + "/users");
var optRes = await http.SendAsync(options);
Console.WriteLine("OPTIONS Allow: " + optRes.Headers.ToString());

var query = new HttpRequestMessage(new HttpMethod("QUERY"), baseUrl + "/users");
query.Content = new StringContent(
    """{"gender":"male","minSalary":12000,"limit":5}""",
    Encoding.UTF8,
    "application/json");
query.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

var res = await http.SendAsync(query);
Console.WriteLine("QUERY status: " + (int)res.StatusCode);
Console.WriteLine("Content-Location: " + res.Content.Headers.ContentLocation);
Console.WriteLine(await res.Content.ReadAsStringAsync());
