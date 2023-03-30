
# PropertyFinder

PropertyFinder is an application that helps clients find properties and brokers market their properties. It was developed using Next.js, Express.js, and Prisma, among other technologies.

## Features

- Property search with filters based on location, price, and property type
- Property listing with photos and detailed information
- Broker dashboard to manage properties and view property insights
- Admin dashboard to manage users and listings

## Technologies Used

- Next.js
- Express.js
- Prisma
- React
- Recoil.js
- MySQL
- Tailwindcss

## Getting Started

To get started with the project, follow these steps:

1. Clone the repository: `git clone https://github.com/TheCodby/property-finder.git`
2. Install the dependencies: `yarn`
3. Create a `.env` file in the (website-database-api) directories with the necessary environment variables
4. Create a `config.json` file in the `api` directory with necessary values
```json
{
  "SENDGRID_API_KEY": "",
  "SENDGRID_EMAIL": "",
  "VERIFYING_EMAILS": true,
  "AWS_ACCESS_KEY_ID": "",
  "AWS_SECRET_ACCESS_KEY": ""
}
```
5. Start the development server: `yarn dev`

## Contributing

Contributions are welcome! If you find any bugs or have suggestions for new features, please create an issue or submit a pull request.

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).
