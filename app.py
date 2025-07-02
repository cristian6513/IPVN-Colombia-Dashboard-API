from flask import Flask, render_template, request, jsonify
import pandas as pd

app = Flask("IPVN Colombia Dashboard & API")

def cargar_limpiar_datos():
    archivo= "anex-IPVN-Itrim2025.xlsx"
    leer_excel=pd.read_excel(archivo,sheet_name="AREAS-DESTINO")
    leer_excel=leer_excel.iloc[5:22, 0:17].fillna("").rename(columns={"Unnamed: 0":"Ciudad",
                                                                      "Unnamed: 1":"Trimestral_Aptos_2024",
                                                                      "Unnamed: 2":"Trimestral_Aptos_2025",
                                                                      "Unnamed: 3":"Trimestral_Casas_2024",
                                                                      "Unnamed: 4":"Trimestral_Casas_2025",
                                                                      "Unnamed: 7":"AñoCorrido_Aptos_2024",
                                                                      "Unnamed: 8":"AñoCorrido_Aptos_2025",
                                                                      "Unnamed: 9":"AñoCorrido_Casas_2024",
                                                                      "Unnamed: 10":"AñoCorrido_Casas_2025",
                                                                      "Unnamed: 13":"Anual_Aptos_2024",
                                                                      "Unnamed: 14":"Anual_Aptos_2025",
                                                                      "Unnamed: 15":"Anual_Casas_2024",
                                                                      "Unnamed: 16":"Anual_Casas_2025"}).replace({"(-)":None})
    del leer_excel['Unnamed: 5']
    del leer_excel['Unnamed: 6']
    del leer_excel['Unnamed: 11']
    del leer_excel['Unnamed: 12']

    return leer_excel

@app.route('/')
def inicio():
    datos=cargar_limpiar_datos()
    datos_lista= datos.to_dict('records')
    return render_template("index.html", datos=datos_lista)


@app.route('/ciudades')
def ciudades():
    datos=cargar_limpiar_datos()
    lista_ciudades= datos['Ciudad'].unique().tolist()
    return jsonify(ciudad=lista_ciudades)

@app.route('/filtro')
def filtro():
    datos=cargar_limpiar_datos()
    ciudades=request.args.get('Ciudad')

    if ciudades!=None:
        datos = datos.loc[datos['Ciudad'] == ciudades]


    return jsonify(datos.to_dict(orient='records'))

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
