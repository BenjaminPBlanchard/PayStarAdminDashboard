# Development Dependencies

Dotnet SDK 3.1

SQL Express

Node- Current LTS Version

# To set up Development Environment

Change Directory into the root of the project and run the following command from the Nuget-Package-Manager
### `update-database`
**NOTE: This will run the migrations inside of the API, and configure your database structure.**
 

Then, go into 'PayStarAdminDashboard/Services/EmailRequest.cs' and change the email field on line 51 to the desired email to send alerts to.

After the correct email is set, travel to 'PayStarAdminDashboard/Startup.cs' and edit the hubspot api key field for both lines 182 and 183.


**Note: Development email Username and Password are in appsettings.json**

Afterwards, execute the following from terminal.
### `cd ClientApp`
### `yarn install` 
**Note: This project is configured using Yarn as the primary package manager. Attempts to implement NPM with generate a package/package-lock that will cause cross-dependency conflicts. Either use Yarn exclusively, or remove all package files and node-modules and regenerate these utilizing your package manager of choice.**
