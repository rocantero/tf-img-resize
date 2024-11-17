resource "random_pet" "react_bucket_name" {
  prefix = "rocantero-img-resize"
  length = 4
}

variable "cloudfront_origin_path" {
  description = "The CloudFront origin path"
  type        = string
  default     = ""
}

variable "cloudfront_price_class" {
  description = "The price class for the CloudFront distribution"
  type        = string
  default     = "PriceClass_All"
}

variable "cloudfront_default_root_object" {
  description = "The default root object for the CloudFront distribution"
  type        = string
  default     = "index.html"
}

module "s3_bucket" {
  source = "terraform-aws-modules/s3-bucket/aws"

  bucket = random_pet.react_bucket_name.id
  acl    = "public-read"

  versioning = {
    enabled = true
  }

  control_object_ownership = true
  object_ownership         = "BucketOwnerPreferred"

  # allow cloudfront access to the bucket
  attach_policy = true
  policy        = data.aws_iam_policy_document.s3_bucket_policy.json

  website = {
    index_document = "index.html"
    error_document = "error.html"
  }
}

# Policy to be attached to the S3 bucket to allow CloudFront access
data "aws_iam_policy_document" "s3_bucket_policy" {
  statement {
    actions   = ["s3:GetObject"]
    resources = ["${module.s3_bucket.s3_bucket_arn}/*"]
    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }
    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"
      values   = [module.cloudfront.cloudfront_distribution_arn]
    }
  }
}



module "cloudfront" {
  source  = "terraform-aws-modules/cloudfront/aws"
  version = "~> 3.2.0"

  origin = {
    s3 = {
      domain_name = module.s3_bucket.s3_bucket_bucket_regional_domain_name
      origin_id   = random_pet.react_bucket_name.id
      origin_access_control = "s3" 
    }
  }


  enabled             = true
  is_ipv6_enabled     = true
  comment             = "CloudFront Distribution pointing to ${random_pet.react_bucket_name.id}"
  default_root_object = var.cloudfront_default_root_object
  price_class         = var.cloudfront_price_class
  create_origin_access_control = true

  origin_access_control = {
    s3 = {
      description      = "CloudFront access to S3"
      origin_type      = "s3"
      signing_behavior = "always"
      signing_protocol = "sigv4"
    }
  }



  default_cache_behavior = {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = random_pet.react_bucket_name.id
    forwarded_values = {
      query_string = false
      cookies = {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }

  viewer_certificate = {
    cloudfront_default_certificate = true
  }

}

# Output the S3 bucket domain name
output "s3_bucket_domain_name" {
  value = module.s3_bucket.s3_bucket_bucket_regional_domain_name
}

# Output the CloudFront domain name
output "cloudfront_domain_name" {
  value = module.cloudfront.cloudfront_distribution_domain_name
}

# Output the CloudFront distribution ID
output "cloudfront_distribution_id" {
  value = module.cloudfront.cloudfront_distribution_id
}




