# Image Resizing Solution

## Overview

This project is a solution for dynamically resizing images on request. It features a front-end application for uploading images and displaying a thumbnail grid of uploaded images. The front-end is implemented using React and is fully responsive. The solution is built on AWS, with all applications provisioned using Terraform. GitHub Actions are used to deploy the applications to AWS, supporting both staging and production environments.

## Technologies

- TypeScript
- React
- Node.js
- Terraform
- AWS
- GitHub Actions

## Features

- **Image Upload**: Users can upload images through the front-end application.
- **Thumbnail Grid**: Uploaded images are displayed in a responsive thumbnail grid.
- **Dynamic Resizing**: Images are resized dynamically using an endpoint.
- **Responsive Design**: The front-end application is fully responsive.
- **AWS Integration**: The solution leverages AWS services for scalability and performance.
- **CI/CD**: GitHub Actions are used for continuous integration and deployment.

## Project Structure

- **Frontend**: Implemented using React and TypeScript.
- **Backend**: Node.js service for handling image resizing.
- **Infrastructure**: Provisioned using Terraform.
- **CI/CD**: GitHub Actions workflows for deployment.

## Getting Started

### Prerequisites

- Node.js
- AWS Account
- Terraform
- GitHub Account

### Installation

1. Clone the repository:
  ```sh
  git clone https://github.com/rocantero/tf-img-resize.git
  cd tf-aws-react-challenge
  ```

2. Install dependencies for the front-end:
  ```sh
  cd frontend
  npm install
  ```

3. Install dependencies for the back-end:
  ```sh
  cd backend
  npm install
  ```
4. Init terraform
  ```sh
  cd terraform
  terraform init
  terraform validate
  terraform plan
  ```
5. Run Terraform
  ```sh
  terraform init
  ```
6. Destroy terraform
  ```sh
  terraform destroy
  ```

### Challenge Completion

#### React frontend
1. App layout, basic components ✅
2. Redux stores, endpoints ✅
3. Styling ❌
4. Unit Tests ❌
5. API Integration via env variables ✅
6. Does it work? Nope, API fails and upload action isn't properly tested

#### AWS Lambda Backend
1. Endpoints for getImages, getResizedImage, postImage ✅
2. Common ImageService for all fetching, saving and resizing ✅
3. Handlers mapped to API Gateway endpoints ✅
3. Unit tests ❌
4. Does it work? Nope, functions fail when called, errors are visible on CloudWatch ❌

#### Terraform
1. Valid terraform set ✅
2. Provision prod environment ✅
3. Provision stage environment ❌
4. AWS Lambda: Zip functions, create S3 bucket, upload, register function, tie to API Gateway and Cloudwatch ✅
5. React: Create S3 bucket, cloudfront policy ✅

#### Github Actions
1. Setup Github Action for Terraform on pull request and push to main
2. Does it work? No, it fails due to package version issues

### Deployment

1. Configure AWS credentials.
2. Initialize and apply Terraform configuration:
  ```sh
  terraform init
  terraform apply
  ```

3. Set up GitHub Actions for CI/CD.

## Contributing

Frequent commits are encouraged. Please follow the commit message guidelines and make sure to test your changes before pushing.

## License

This project is licensed under the MIT License.

## Contact

For any questions or feedback, please contact [cantero.rodrigo91@gmail.com].
