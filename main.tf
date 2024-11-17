# Copyright (c) HashiCorp, Inc.
# SPDX-License-Identifier: MPL-2.0

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      hashicorp-learn = "lambda-api-gateway"
    }
  }

}

# Create an S3 bucket to store the Lambda function code
resource "random_pet" "lambda_bucket_name" {
  prefix = "rocantero-img-resize"
  length = 4
}

resource "aws_s3_bucket" "lambda_bucket" {
  bucket = random_pet.lambda_bucket_name.id
}

resource "aws_s3_bucket_ownership_controls" "lambda_bucket" {
  bucket = aws_s3_bucket.lambda_bucket.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_acl" "lambda_bucket" {
  depends_on = [aws_s3_bucket_ownership_controls.lambda_bucket]

  bucket = aws_s3_bucket.lambda_bucket.id
  acl    = "private"
}
# Package lambda function code and upload to S3
data "archive_file" "lambda_img_service" {
  type = "zip"

  source_dir  = "${path.module}/backend"
  output_path = "${path.module}/img-service.zip"
}

resource "aws_s3_object" "lambda_img_service" {
  bucket = aws_s3_bucket.lambda_bucket.id

  key    = "img-service.zip"
  source = data.archive_file.lambda_img_service.output_path

  etag = filemd5(data.archive_file.lambda_img_service.output_path)
}
# Register lambda functions
# Get All Images
resource "aws_lambda_function" "get_all_images" {
  function_name = "GetAllImages"

  s3_bucket = aws_s3_bucket.lambda_bucket.id
  s3_key    = aws_s3_object.lambda_img_service.key

  runtime = "nodejs20.x"
  handler = "getAll.handler"

  source_code_hash = data.archive_file.lambda_img_service.output_base64sha256

  role = aws_iam_role.lambda_exec.arn
}

resource "aws_cloudwatch_log_group" "get_all_images" {
  name = "/aws/lambda/${aws_lambda_function.get_all_images.function_name}"

  retention_in_days = 30
}
# Get Single Resized Image
resource "aws_lambda_function" "get_resized_image" {
  function_name = "GetResizedImage"

  s3_bucket = aws_s3_bucket.lambda_bucket.id
  s3_key    = aws_s3_object.lambda_img_service.key

  runtime = "nodejs20.x"
  handler = "get.handler"

  source_code_hash = data.archive_file.lambda_img_service.output_base64sha256

  role = aws_iam_role.lambda_exec.arn
}

resource "aws_cloudwatch_log_group" "get_resized_image" {
  name = "/aws/lambda/${aws_lambda_function.get_resized_image.function_name}"

  retention_in_days = 30
}
# Post / Create new image
resource "aws_lambda_function" "upload_image" {
  function_name = "UploadImage"

  s3_bucket = aws_s3_bucket.lambda_bucket.id
  s3_key    = aws_s3_object.lambda_img_service.key

  runtime = "nodejs20.x"
  handler = "post.handler"

  source_code_hash = data.archive_file.lambda_img_service.output_base64sha256

  role = aws_iam_role.lambda_exec.arn
}

resource "aws_cloudwatch_log_group" "upload_image" {
  name = "/aws/lambda/${aws_lambda_function.upload_image.function_name}"

  retention_in_days = 30
}

resource "aws_iam_role" "lambda_exec" {
  name = "serverless_lambda"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Sid    = ""
      Principal = {
        Service = "lambda.amazonaws.com"
      }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_policy" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}


# Create HTTP API with API Gateway
resource "aws_apigatewayv2_api" "lambda" {
  name          = "serverless_lambda_gw"
  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_stage" "lambda" {
  api_id = aws_apigatewayv2_api.lambda.id

  name        = "serverless_production"
  auto_deploy = true

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.api_gw.arn

    format = jsonencode({
      requestId               = "$context.requestId"
      sourceIp                = "$context.identity.sourceIp"
      requestTime             = "$context.requestTime"
      protocol                = "$context.protocol"
      httpMethod              = "$context.httpMethod"
      resourcePath            = "$context.resourcePath"
      routeKey                = "$context.routeKey"
      status                  = "$context.status"
      responseLength          = "$context.responseLength"
      integrationErrorMessage = "$context.integrationErrorMessage"
      }
    )
  }
}

# GET All Images

resource "aws_apigatewayv2_integration" "get_all_images" {
  api_id = aws_apigatewayv2_api.lambda.id

  integration_uri    = aws_lambda_function.get_all_images.invoke_arn
  integration_type   = "AWS_PROXY"
  integration_method = "POST"
}

resource "aws_apigatewayv2_route" "get_all_images" {
  api_id = aws_apigatewayv2_api.lambda.id

  route_key = "GET /images"
  target    = "integrations/${aws_apigatewayv2_integration.get_all_images.id}"
}

resource "aws_cloudwatch_log_group" "api_gw" {
  name = "/aws/api_gw/${aws_apigatewayv2_api.lambda.name}"

  retention_in_days = 30
}

resource "aws_lambda_permission" "api_gw_getall" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.get_all_images.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.lambda.execution_arn}/*/*"
}

# GET Resized Image
resource "aws_apigatewayv2_integration" "get_resized_image" {
  api_id = aws_apigatewayv2_api.lambda.id

  integration_uri    = aws_lambda_function.get_resized_image.invoke_arn
  integration_type   = "AWS_PROXY"
  integration_method = "POST"
}

resource "aws_apigatewayv2_route" "get_resized_image" {
  api_id = aws_apigatewayv2_api.lambda.id

  route_key = "GET /images/{dimensions}/{imageId}"
  target    = "integrations/${aws_apigatewayv2_integration.get_resized_image.id}"
}

resource "aws_lambda_permission" "api_gw_get" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.get_resized_image.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.lambda.execution_arn}/*/*"
}

# Upload new image
resource "aws_apigatewayv2_integration" "upload_image" {
  api_id = aws_apigatewayv2_api.lambda.id

  integration_uri    = aws_lambda_function.upload_image.invoke_arn
  integration_type   = "AWS_PROXY"
  integration_method = "POST"
}

resource "aws_apigatewayv2_route" "upload_image" {
  api_id = aws_apigatewayv2_api.lambda.id

  route_key = "POST /images"
  target    = "integrations/${aws_apigatewayv2_integration.upload_image.id}"
}

resource "aws_lambda_permission" "api_gw_upload" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.upload_image.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.lambda.execution_arn}/*/*"
}
