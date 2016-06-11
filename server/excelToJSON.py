import xlrd, json

with open('alumnosIntercambio.json', 'w') as outfile:
    book = xlrd.open_workbook("VacantesIntercambioFeb-16.xls")
    sh = book.sheet_by_index(0)
    carreras = {"Industrial":"ing-industrial", u"Electr\xf3nica":"ing-electronica", u"Inform\u00e1tica":"ing-informatica", u"An\u00e1lisis de Sistemas": "lic-sistemas", "Naval":"ing-naval", u"Qu\u00edmica":"ing-quimica", u"Mec\u00e1nica":"ing-mecanica",  u"Industrial - Mec\xe1nica":"ing-industrial", "Civil":"ing-civil"}
    outfile.write("[")
    for rx in range(1, sh.nrows):
        name = sh.cell_value(rowx=rx, colx=3).encode('utf-8')
        lastName = sh.cell_value(rowx=rx, colx=2).encode('utf-8')
        title = name + " " + lastName
        universidad = sh.cell_value(rowx=rx, colx=0)
        carrera = carreras[sh.cell_value(rowx=rx, colx=1)]
        mail = sh.cell_value(rowx=rx, colx=5)
        data = json.dumps({"title": title, "universidad": universidad, "description": carrera + "; " + mail, "carrera": carrera}, separators=(',',':'))
        outfile.write(data)
        if(rx != sh.nrows-1):
            outfile.write(",")

    outfile.write("]")
