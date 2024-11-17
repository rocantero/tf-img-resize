terraform {

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 4.29.0, < 6.0.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.6.0"
    }
    archive = {
      source  = "hashicorp/archive"
      version = "~> 2.4.2"
    }
  }

  required_version = "~> 1.2"
}
