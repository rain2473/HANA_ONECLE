from django.test import TestCase
from django.http import HttpResponse
# Create your tests here.
import sys, os
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))


# # 디비 연결
# pgdb = pg.PostgresHandler(user=con.ID_IJ, password=con.PW_IJ)

# tmp = ap.get_world_index('^GSPC','20221025','20221026')
# print(tmp)
