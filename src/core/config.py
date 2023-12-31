"""config file"""
import os
import random
from dotenv import load_dotenv
from pydantic import ConfigDict


BASE_DIR = "/".join(os.path.dirname(os.path.realpath(__file__)).split("/")[:-1])
print(BASE_DIR)
# load config
load_dotenv()


db_url = os.getenv("DB_NAME")
admin_email = os.getenv("ADMIN_EMAIL")
admin_pass = os.getenv("ADMIN_PASS")
admin_fullname = os.getenv("ADMIN_FULLNAME")
admin_username = os.getenv("ADMIN_USERNAME")
admin_phone = os.getenv("ADMIN_PHONE")
admin_perm = os.getenv("ADMIN_PERMISSIONS")


def to_camel_case(snake_str: str):
    """
    Converts a string in snake case to camel case
    :param snake_str: A string in snake case
    :return: A string in camel case
    """

    components = snake_str.split("_")
    components = [components[0]] + [x.capitalize() for x in components[1:]]
    camel_case_str = "".join(components)
    return camel_case_str


simple_pydantic_model_config = ConfigDict(
    str_strip_whitespace=True,
    use_enum_values=True,
    alias_generator=to_camel_case,
    populate_by_name=True
)

