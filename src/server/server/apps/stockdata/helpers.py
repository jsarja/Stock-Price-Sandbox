class DateHelpers:
    @staticmethod
    def string_date_is_smaller(date1, date2):
        date1_year  = int(date1[0:4])
        date1_month = DateHelpers.month_or_dayt_to_int(date1[5:7]) 
        date1_day = DateHelpers.month_or_dayt_to_int(date1[8:])
        date2_year  = int(date1[0:4])
        date2_month = DateHelpers.month_or_dayt_to_int(date1[5:7]) 
        date2_day = DateHelpers.month_or_dayt_to_int(date1[8:])

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