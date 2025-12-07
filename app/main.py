from flask import Flask, render_template, request, jsonify
import os

app = Flask(__name__)
app.config["TEMPLATES_AUTO_RELOAD"] = True
app.config["SEND_FILE_MAX_AGE_DEFAULT"] = 0

@app.route("/")
def index():
    return render_template("index.html")

@app.post("/save_sr")
def save_sr():
    data=request.get_json(silent=True) or {}
    sr=str(data.get("srNumber","")).strip()
    content=str(data.get("content",""))
    if not sr or not content:
        return jsonify({"message":"Invalid input"}), 400
    safe="".join(ch for ch in sr if ch.isalnum() or ch in ("-","_"))
    if not safe:
        return jsonify({"message":"Invalid SR number"}), 400
    base=os.path.join(os.path.dirname(os.path.abspath(__file__)),"..","data")
    os.makedirs(base,exist_ok=True)
    path=os.path.join(base,f"{safe}.txt")
    with open(path,"w",encoding="utf-8") as f:
        f.write(content)
    return jsonify({"message":"Saved","file":path})

@app.get("/load_sr")
def load_sr():
    sr=str(request.args.get("sr",""))
    sr=sr.strip()
    safe="".join(ch for ch in sr if ch.isalnum() or ch in ("-","_"))
    if not safe:
        return jsonify({"message":"Invalid SR number"}), 400
    base=os.path.join(os.path.dirname(os.path.abspath(__file__)),"..","data")
    path=os.path.join(base,f"{safe}.txt")
    if not os.path.exists(path):
        return jsonify({"message":"Not found"}), 404
    with open(path,"r",encoding="utf-8") as f:
        content=f.read()
    return jsonify({"content":content})

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
