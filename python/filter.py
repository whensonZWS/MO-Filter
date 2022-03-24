import sys
from collections import Counter
import configparser as cfp
import json
rules = cfp.ConfigParser(strict = False, interpolation = None, inline_comment_prefixes = (';',))
rules.optionxform = str
rules.read('rulesmo.ini')

art = cfp.ConfigParser(strict = False, interpolation = None, inline_comment_prefixes = (';',))
art.optionxform = str
art.read('artmo.ini')

lang = 'e'

k = 0

inf_list = set()
veh_list = set()
bud_list = set()
full_list = {}


a_list = {'GACNST'}
s_list = {'NACNST'}
e_list = {'YACNST'}
f_list = {'FACNST'}

for key in rules['InfantryTypes']:
	value = rules['InfantryTypes'][key]
	inf_list.add(value)
	full_list[value] = key

for key in rules['VehicleTypes']:
	value = rules['VehicleTypes'][key]
	veh_list.add(value)
	full_list[value] = key

for key in rules['AircraftTypes']:
	value = rules['AircraftTypes'][key]
	veh_list.add(value)
	full_list[value] = key

for key in rules['BuildingTypes']:
	value = rules['BuildingTypes'][key]
	bud_list.add(value)
	full_list[value] = key
	if rules.has_option(value,'Prerequisite'):
		arr = rules[value]['Prerequisite'].split(',')
		
		if 'GACNST' in arr:
			a_list.add(value)
		elif 'NACNST' in arr:
			s_list.add(value)
		elif 'YACNST' in arr:
			e_list.add(value)
		elif 'FACNST' in arr:
			f_list.add(value)
	
		
def faction(str,str2=''):
	f = ''
	arr = str.split(',')
	arr2 = str2.split(',')
	for i in arr:
		if i in a_list:
			f = 'ga'
		elif i in s_list:
			f = 'na'
		elif i in e_list:
			f = 'ya'
		elif i in f_list:
			f = 'fa'
	if f != '':
		return f
	else:
		for k in arr2:
			if k in ('Europeans','UnitedStates','Pacific'):
				return 'ga'
			if k in ('USSR','Latin','Chinese'):
				return 'na'
			if k in ('PsiCorps','Headquaters','ScorpionCell'):
				return 'ya'
			if k in ('Guild1','Guild2','Guild3'):
				return 'fa'
	return ""

def image(s,lower_case = True):
	r = ''
	im = s
	if rules.has_option(s,'Image'):
		im = rules[s]['Image']
	if art.has_option(im,'CameoPCX'):
		r = art[im]['CameoPCX'][0:-4]
	if lower_case:
		return r.lower()
	else:
		return r

def cat(str):
	if str in inf_list:
		return 'inf'
	if str in veh_list:
		return 'veh'
	if str in bud_list:
		return 'bud'
	return "no cat"
		
def tech(t):
	if t < 5:
		return 't1'
	if t < 8:
		return 't2'
	if t < 11:
		return 't3'
	return 't5'

# general rule for inclusion:
#	including unit of normal tech level and Pre-requisite
#	including unit within inclusion file	
#	excluding unit with name that contains '('
# inclusion file: unit_include.json, a list of units with their own property, key in manually. this code won't overwrite existing property


# json example:
# data = {
#	"E1": {
#	"image": "http://mentalomega.com/images/cameo/giicon.png",
#	"name": "GI",
#	"description": "Name: GI \n ini: E1 \n VoiceAttack: ",
#	"filter": "t1 ga inf"
# 	}
# }

# construct object
data = {}
include = {}
with open('include.json','r') as input:
	include = json.load(input)

for item in rules:

	if (rules.has_option(item,'Prerequisite') and rules.has_option(item,'TechLevel') \
		and int(rules[item]['TechLevel']) in range(1,11) and rules.has_option(item,'Name') and '(' not in rules[item]['Name']) or item in include :
		
		if item not in include:
			data[item] = {}	
		else:
			data[item] = {}
			data[item] = dict(include[item])
		

		if 'image' not in data[item]:
			data[item]['image'] = 'http://mentalomega.com/images/cameo/{}.png'.format(image(item))

		if 'local' not in data[item]:
			data[item]['local'] = "./assets/{}.png".format(image(item,False))
			
		# name
		if 'name' not in data[item]:
			data[item]['name'] = rules[item]['Name']
			
		# description
		if 'description' not in data[item]:
			data[item]['description'] = 'Name: {}<br>INI Name: {}'.format(rules[item]["Name"],item)
			if rules.has_option(item,'VoiceAttack'):
				data[item]['description'] += "<br>VoiceAttack: " + rules[item]['VoiceAttack']
			img = image(item,False)
			if img:
				data[item]['description'] += "<br>Art: " + img

			data[item]['description'] += "<br>Index: " + full_list[item]

		# filter
		if 'filter' not in data[item]:
			data[item]['filter'] = faction(rules.get(item,'Prerequisite',fallback=''),rules.get(item,'Owner',fallback='')) + ' ' + cat(item) + ' ' + tech(int(rules[item]['TechLevel']))

with open('336mo_data.json','w') as output:
	json.dump(data,output,indent=4)
