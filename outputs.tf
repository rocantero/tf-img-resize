output "lambda_bucket_name" {
  description = "Name of the S3 bucket used to store function code."

  value = aws_s3_bucket.lambda_bucket.id
}

output "base_url" {
  description = "Base URL for API Gateway stage."

  value = aws_apigatewayv2_stage.lambda.invoke_url
}

output "function_name_get_all" {
  description = "Name of the Lambda functions."

  value = aws_lambda_function.get_all_images.function_name
}

output "function_name_get" {
  description = "Name of the Lambda functions."

  value = aws_lambda_function.get_resized_image.function_name
}

output "function_name_upload" {
  description = "Name of the Lambda functions."

  value = aws_lambda_function.upload_image.function_name
}
