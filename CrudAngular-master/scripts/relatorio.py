import urllib.request, json, ssl, os

TOKEN = os.environ.get("CANVAS_TOKEN")
ctx = ssl.create_default_context()
HEADERS = {"Authorization": f"Bearer {TOKEN}"}

def api_get(url):
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, context=ctx) as resp:
        return json.loads(resp.read())

courses = {
    28402: {"name": "25086 - DESENVOLVIMENTO BACK-END", "ap1_id": 100664},
    28952: {"name": "25092 - APLICACOES FRONT-END (turma 28952)", "ap1_id": 99306},
    27978: {"name": "25092 - APLICACOES FRONT-END (turma 27978)", "ap1_id": 99898},
}

for cid, info in courses.items():
    print(f"\n{'='*60}")
    print(f"CURSO: {info['name']} (ID: {cid})")
    print(f"{'='*60}")

    # Get all enrollments (not just active - try all states)
    try:
        enrollments = api_get(
            f"https://ulbra.instructure.com/api/v1/courses/{cid}/enrollments"
            f"?type[]=StudentEnrollment&per_page=100&state[]=active"
        )
    except Exception as e:
        print(f"  Erro ao buscar matriculas: {e}")
        continue

    students = {}
    for e in enrollments:
        u = e.get("user", {})
        uid = u.get("id")
        uname = u.get("name", "?")
        if e.get("type") == "StudentEnrollment" and uid:
            students[uid] = uname

    if not students:
        # Fallback: try without state filter
        try:
            enrollments = api_get(
                f"https://ulbra.instructure.com/api/v1/courses/{cid}/enrollments"
                f"?type[]=StudentEnrollment&per_page=100"
            )
            for e in enrollments:
                u = e.get("user", {})
                uid = u.get("id")
                uname = u.get("name", "?")
                if e.get("type") == "StudentEnrollment" and uid:
                    students[uid] = uname
        except Exception as e2:
            print(f"  Erro fallback: {e2}")
            continue

    if not students:
        print("  Nenhum aluno encontrado.")
        continue

    print(f"  Total de alunos: {len(students)}")

    # Get all assignments
    assignments = api_get(f"https://ulbra.instructure.com/api/v1/courses/{cid}/assignments?per_page=100")
    assignment_ids = [a["id"] for a in assignments]
    assignment_names = {a["id"]: a["name"] for a in assignments}

    submitted_anything = set()
    ap1_submitted = set()
    ap1_missing = set(students.keys())

    for aid in assignment_ids:
        try:
            subs = api_get(
                f"https://ulbra.instructure.com/api/v1/courses/{cid}/assignments/{aid}/submissions?per_page=100"
            )
        except:
            continue

        for s in subs:
            uid = s.get("user_id")
            if uid in students:
                attempt = s.get("attempt")
                if attempt is not None and attempt > 0:
                    submitted_anything.add(uid)
                ws = s.get("workflow_state", "")
                if aid == info["ap1_id"] and ws in ("submitted", "graded"):
                    ap1_submitted.add(uid)
                    ap1_missing.discard(uid)

    # AP1 report
    print(f"\n  --- AP1 (ID: {info['ap1_id']}) ---")
    print(f"  Entregaram AP1: {len(ap1_submitted)}")
    print(f"  NAO entregaram AP1: {len(ap1_missing)}")
    for uid in sorted(ap1_missing):
        print(f"    - {students[uid]} (ID: {uid})")

    # Never submitted anything
    never_submitted = set(students.keys()) - submitted_anything
    print(f"\n  --- NUNCA entregaram NENHUMA atividade ---")
    print(f"  Total: {len(never_submitted)}")
    for uid in sorted(never_submitted):
        print(f"    - {students[uid]} (ID: {uid})")
