from .errors import RequestDataMissingError, InvalidDateError

class DateHelpers:
    @staticmethod
    def string_date_is_smaller(date1, date2):
        date1_year  = int(date1[0:4])
        date1_month = DateHelpers.month_or_day_to_int(date1[5:7]) 
        date1_day = DateHelpers.month_or_day_to_int(date1[8:])
        date2_year  = int(date2[0:4])
        date2_month = DateHelpers.month_or_day_to_int(date2[5:7]) 
        date2_day = DateHelpers.month_or_day_to_int(date2[8:])

        if date1_year == date2_year and date1_month == date2_month:
            return date1_day < date2_day
        if date1_year == date2_year:
            return date1_month < date2_month
        return date1_year < date2_year

    @staticmethod
    def month_or_day_to_int(string):
        if string[0] == '0':
            return int(string[1])
        return int(string)

class ValidationHelpers:
    @staticmethod
    def validate_long_term_request_data(data):
        if ("stock" not in data) or ("start_date" not in data) or ("end_date" not in data):
            return None, None, None, \
                "Please provide 'stock', 'start_date' and 'end_date query parameters in the request."

        start_valid = ValidationHelpers.validate_date(data["start_date"])
        end_valid = ValidationHelpers.validate_date(data["end_date"])

        if(not start_valid) or (not end_valid):
            return None, None, None, "Please give dates in format: YYYY-MM-DD"

        return data["stock"], data["start_date"], data["end_date"], None

    @staticmethod
    def validate_latest_daily_request_data(data):
        if "stock" not in data:
            return None, "Please provide 'stock' query parameter in the request."
        return data["stock"], None
    
    @staticmethod
    def validate_date(string):
        try: 
            int(string[0:4])
            DateHelpers.month_or_day_to_int(string[5:7])
            DateHelpers.month_or_day_to_int(string[8:])
        except ValueError:
            return False
        #TODO: Check if year, month & date within valid ranges
        return (string[4] == '-') and (string[7] == '-') and len(string) == 10